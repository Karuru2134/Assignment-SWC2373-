document.getElementById('submitButton').addEventListener('click', function() {
    const token = document.getElementById('token').value;
    const option = document.getElementById('options').value;
    const outputDiv = document.getElementById('output');
    const formSection = document.getElementById('formSection');
    const outputSection = document.getElementById('outputSection');
    const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

    // Hide form after submitting
    formSection.classList.add('hidden');
    outputSection.style.display = 'block';

    switch (option) {
        case '0':
            // Test connection
            fetch('https://webexapis.com/v1/people/me', { headers })
                .then(response => response.json())
                .then(data => outputDiv.innerHTML = `Connected as ${data.displayName}`)
                .catch(error => outputDiv.innerHTML = `Connection failed: ${error.message}`);
            break;
        case '1':
            // Display User Info
            fetch('https://webexapis.com/v1/people/me', { headers })
                .then(response => response.json())
                .then(data => outputDiv.innerHTML = `Name: ${data.displayName}, Email: ${data.emails.join(', ')}`)
                .catch(error => outputDiv.innerHTML = `Error: ${error.message}`);
            break;
        case '2':
            // Display Rooms
            fetch('https://webexapis.com/v1/rooms', { headers })
                .then(response => response.json())
                .then(data => {
                    const rooms = data.items.slice(0, 5).map(room => `${room.title} (ID: ${room.id})`).join('<br>');
                    outputDiv.innerHTML = rooms || 'No rooms found';
                })
                .catch(error => outputDiv.innerHTML = `Error: ${error.message}`);
            break;
        case '3':
            // Create Room
            const roomTitle = prompt('Enter room title:');
            if (roomTitle) {
                fetch('https://webexapis.com/v1/rooms', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify({ title: roomTitle })
                })
                .then(response => response.json())
                .then(data => outputDiv.innerHTML = `Room '${data.title}' created`)
                .catch(error => outputDiv.innerHTML = `Error: ${error.message}`);
            }
            break;
        case '4':
            // Send message to room
            fetch('https://webexapis.com/v1/rooms', { headers })
                .then(response => response.json())
                .then(data => {
                    const roomTitles = data.items.slice(0, 5).map((room, index) => `${index + 1}. ${room.title}`).join('\n');
                    const roomChoice = prompt(`Choose a room:\n${roomTitles}`);
                    const roomIndex = parseInt(roomChoice, 10) - 1;
                    if (roomIndex >= 0 && roomIndex < 5) {
                        const message = prompt('Enter message:');
                        if (message) {
                            fetch('https://webexapis.com/v1/messages', {
                                method: 'POST',
                                headers,
                                body: JSON.stringify({
                                    roomId: data.items[roomIndex].id,
                                    text: message
                                })
                            })
                            .then(() => outputDiv.innerHTML = 'Message sent')
                            .catch(error => outputDiv.innerHTML = `Error: ${error.message}`);
                        }
                    } else {
                        outputDiv.innerHTML = 'Invalid room selected';
                    }
                })
                .catch(error => outputDiv.innerHTML = `Error: ${error.message}`);
            break;
        default:
            outputDiv.innerHTML = 'Invalid option selected';
    }
});

