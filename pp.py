import os
from telethon import TelegramClient
from telethon.sessions import StringSession

# Teri API Credentials
API_ID = 39044009
API_HASH = "879463dab48b1296f68aaf274b0a557d"

# GitHub Secrets se session string uthayega
SESSION_STRING = os.environ.get("TELEGRAM_SESSION", "")

async def main():
    client = TelegramClient(StringSession(SESSION_STRING), API_ID, API_HASH)
    await client.connect()
    
    group_link = "https://t.me/+5qA44e3B2s9hYThl"
    command_text = "/like ind 4232090116"
    
    try:
        await client.send_message(group_link, command_text)
        print("✅ Command successfully bhej diya gaya hai, Maharaj!")
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        await client.disconnect()

import asyncio
asyncio.run(main())
