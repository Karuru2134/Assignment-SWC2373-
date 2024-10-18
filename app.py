from flask import WebexTeamsAPI
import sys

# Initialize the Webex API using the token
def init_api():
    token = input("Enter your Webex Token: ")
    return WebexTeamsAPI(access_token=token)

# Test the connection to the Webex server
def test_connection(api):
    try:
        me = api.people.me()
        print(f"Connection Successful! Logged in as {me.displayName}")
    except Exception as e:
        print(f"Connection failed: {str(e)}")

# Display user information (Name, Nickname, Emails)
def display_user_info(api):
    try:
        me = api.people.me()
        print(f"Name: {me.displayName}")
        print(f"Nickname: {me.nickName}")
        print(f"Emails: {', '.join(me.emails)}")
    except Exception as e:
        print(f"Failed to retrieve user info: {str(e)}")

# Display a list of rooms (Room ID, Title, Created Date, Last Activity)
def display_rooms(api, num_rooms=5):
    try:
        rooms = api.rooms.list()
        room_list = list(rooms)[:num_rooms]  # Limit to 5 rooms
        for room in room_list:
            print(f"Room ID: {room.id}")
            print(f"Room Title: {room.title}")
            print(f"Created Date: {room.created}")
            print(f"Last Activity: {room.lastActivity}")
            print("-" * 40)
    except Exception as e:
        print(f"Failed to retrieve rooms: {str(e)}")

# Create a new room
def create_room(api):
    try:
        room_title = input("Enter the title of the new room: ")
        room = api.rooms.create(title=room_title)
        print(f"Room '{room.title}' created successfully!")
    except Exception as e:
        print(f"Failed to create room: {str(e)}")

# Send a message to a room
def send_message_to_room(api):
    try:
        rooms = api.rooms.list()
        room_list = list(rooms)[:5]  # Limit to 5 rooms

        for idx, room in enumerate(room_list):
            print(f"{idx + 1}: {room.title}")

        room_choice = int(input("Choose a room by number to send a message: ")) - 1
        if 0 <= room_choice < len(room_list):
            room_id = room_list[room_choice].id
            message = input("Enter your message: ")
            api.messages.create(roomId=room_id, text=message)
            print("Message sent successfully!")
        else:
            print("Invalid room choice.")
    except Exception as e:
        print(f"Failed to send message: {str(e)}")

# Main menu for the application
def main_menu(api):
    while True:
        print("\nMain Menu:")
        print("0: Test Webex Connection")
        print("1: Display User Info")
        print("2: Display List of Rooms")
        print("3: Create a Room")
        print("4: Send Message to a Room")
        print("5: Exit")

        choice = input("Choose an option: ")

        if choice == '0':
            test_connection(api)
        elif choice == '1':
            display_user_info(api)
        elif choice == '2':
            display_rooms(api)
        elif choice == '3':
            create_room(api)
        elif choice == '4':
            send_message_to_room(api)
        elif choice == '5':
            print("Exiting the application.")
            sys.exit()
        else:
            print("Invalid option. Please try again.")

if __name__ == "__main__":
    api = init_api()
    main_menu(api)
