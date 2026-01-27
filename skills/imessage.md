---
name: iMessage Manager
version: 2.0.0
author: newth.ai
category: personal
tags:
  - imessage
  - messaging
  - macos
  - automation
compatibility:
  - claude
---

# iMessage Manager

Manage iMessage conversations using the `imsg` CLI tool. List chats, read history, send messages, watch incoming messages in real-time, and find unreplied threads.

## Triggers

Use this skill when the user needs to:
- Read iMessage conversation history
- Send iMessages or SMS from the terminal
- Find unreplied message threads
- Search contacts by name
- Monitor incoming messages in real-time
- List recent conversations

Keywords: "imessage", "text", "message", "sms", "unreplied", "send text", "read messages", "watch messages"

## Prerequisites

Requires `imsg` CLI tool installed:

```bash
brew install imsg
```

## Quick Reference

| Task | Command |
|------|---------|
| List recent chats | `imsg chats --limit 20` |
| Read chat history | `imsg history --chat-id N --limit 50` |
| Send message | `imsg send --to "+1234567890" --text "message"` |
| Send to chat | `imsg send --chat-id N --text "message"` |
| Watch incoming | `imsg watch` |

All commands support `--json` for structured output.

## Usage Examples

### List Recent Chats

```bash
# Recent 10 chats
imsg chats --limit 10

# JSON output for parsing
imsg chats --limit 20 --json
```

Output includes: `id` (chat_id), `identifier`, `name`, `service`, `last_message_at`

### Read Message History

```bash
# By chat ID (from imsg chats)
imsg history --chat-id 186 --limit 30

# With attachments metadata
imsg history --chat-id 186 --limit 20 --attachments

# Date range filter
imsg history --chat-id 186 --start 2025-01-01T00:00:00Z --end 2025-01-31T00:00:00Z

# JSON for parsing
imsg history --chat-id 186 --limit 50 --json
```

### Send Messages

```bash
# To phone number
imsg send --to "+14155551234" --text "Hey!"

# To existing chat by ID
imsg send --chat-id 186 --text "Thanks!"

# With attachment
imsg send --to "+14155551234" --text "Check this out" --file ~/photo.jpg

# Force service type (imessage or sms)
imsg send --to "+14155551234" --text "Hi" --service imessage
```

### Watch Incoming Messages (Real-time)

```bash
# Stream all incoming messages
imsg watch

# JSON output for automation
imsg watch --json
```

## Workflow: Reply to Someone

1. List recent chats to find the conversation:
   ```bash
   imsg chats --limit 20 --json
   ```

2. Read conversation context:
   ```bash
   imsg history --chat-id N --limit 20
   ```

3. Send reply:
   ```bash
   imsg send --chat-id N --text "Your message here"
   ```

## Workflow: Message by Phone Number

1. Send directly to phone number:
   ```bash
   imsg send --to "+14155551234" --text "Hey!"
   ```

## Database Locations

- **Messages:** `~/Library/Messages/chat.db`
- **Contacts:** `~/Library/Application Support/AddressBook/Sources/*/AddressBook-v22.abcddb`

## Best Practices

1. **Always confirm before sending** - verify recipient and message content
2. **Use chat-id for replies** - more reliable than phone number for existing conversations
3. **Check service type** - some contacts may only have SMS, not iMessage
4. **Use JSON output** - easier to parse programmatically with `--json` flag
5. **Watch for rate limits** - don't spam messages too quickly

## Limitations

- macOS only (requires Messages.app database access)
- Cannot read messages from other Apple devices unless synced locally
- Group chat identifiers are UUIDs, not human-readable
- Attachments require file paths, not URLs
