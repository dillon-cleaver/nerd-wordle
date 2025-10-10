# API Testing Guide

This guide covers how to manually test the Nerd Wordle API endpoints using tools like Yaak, Postman, or any HTTP client.

## Table of Contents

- [Setup Options](#setup-options)
- [Base URLs](#base-urls)
- [Authentication](#authentication)
- [Endpoint Reference](#endpoint-reference)
- [Yaak Collection Setup](#yaak-collection-setup)
- [Testing Scenarios](#testing-scenarios)
- [Troubleshooting](#troubleshooting)

## Setup Options

### Option 1: Local Development with Firebase Emulators (Recommended)

Start the Firebase emulators for local testing:

```bash
cd functions
pnpm run emulator:start
```

This will start:

- Functions emulator on `localhost:5001`
- Firestore emulator on `localhost:8080`
- Firebase UI on `localhost:4000`

### Option 2: Production Testing

Test against the deployed production endpoints.

**⚠️ Warning:** Be careful when testing against production to avoid creating test data in the live database.

## Base URLs

### Local Development

```
http://localhost:5001/nerd-word-cfda3/us-central1/api
```

### Production

```
https://us-central1-nerd-word-cfda3.cloudfunctions.net/api
```

## Authentication

Most endpoints require Firebase authentication. You'll need to include a Firebase ID token in the `Authorization` header.

### Getting Firebase ID Tokens

#### Method 1: From Your App (Easiest)

1. Run your app in development mode
2. Sign in with a user
3. Add temporary logging to get the token:

```javascript
// In your app code
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken();
  console.log("Firebase ID Token:", token);
}
```

#### Method 2: Firebase Auth REST API

You can authenticate directly via Firebase's REST API. See [Firebase Auth REST API documentation](https://firebase.google.com/docs/reference/rest/auth) for details.

#### Method 3: Using Firebase CLI

Export user data for testing:

```bash
firebase auth:export users.json --project nerd-word-cfda3
```

### Using Auth Tokens

Include the token in your requests:

```
Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
```

## Endpoint Reference

### Public Endpoints (No Authentication Required)

#### GET /words

Fetch all words in the database.

- **URL:** `{base_url}/words`
- **Method:** GET
- **Response:** List of all words with metadata

#### GET /words/:id

Fetch a specific word by ID.

- **URL:** `{base_url}/words/APPLE`
- **Method:** GET
- **Parameters:** `id` - Word ID (case-insensitive)
- **Response:** Single word object

#### GET /daily-puzzle/today

Fetch today's daily puzzle.

- **URL:** `{base_url}/daily-puzzle/today`
- **Method:** GET
- **Response:** Today's puzzle with word and metadata

#### GET /daily-puzzle/:date

Fetch daily puzzle for a specific date.

- **URL:** `{base_url}/daily-puzzle/2025-08-28`
- **Method:** GET
- **Parameters:** `date` - Date in YYYY-MM-DD format
- **Response:** Puzzle for the specified date

### Authenticated Endpoints (Require Firebase ID Token)

#### POST /puzzle-result

Submit a completed puzzle result.

- **URL:** `{base_url}/puzzle-result`
- **Method:** POST
- **Headers:**
  ```
  Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "id": "puzzle-2025-08-28-user123",
    "word": "APPLE",
    "guesses": ["GRAPE", "PLANE", "APPLE"],
    "attempts": 3,
    "date": "2025-08-28T10:00:00.000Z",
    "status": "win",
    "edition": 1,
    "hintIndex": 0,
    "letterTracking": [
      {
        "letter": "A",
        "status": "correct",
        "position": 0
      },
      {
        "letter": "P",
        "status": "correct",
        "position": 1
      }
    ]
  }
  ```

#### GET /puzzle-history

Fetch user's puzzle completion history.

- **URL:** `{base_url}/puzzle-history`
- **Method:** GET
- **Headers:**
  ```
  Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
  ```
- **Response:** Array of user's completed puzzles

#### POST /daily-puzzle

Create a new daily puzzle (Admin/Testing only).

- **URL:** `{base_url}/daily-puzzle`
- **Method:** POST
- **Headers:**
  ```
  Authorization: Bearer YOUR_FIREBASE_ID_TOKEN
  Content-Type: application/json
  ```
- **Body:**
  ```json
  {
    "date": "2025-08-29",
    "wordId": "GRAPE"
  }
  ```

## Yaak Collection Setup

### Environment Variables

Create these environment variables in Yaak:

#### Local Development Environment

- `base_url`: `http://localhost:5001/nerd-word-cfda3/us-central1/api`
- `auth_token`: `YOUR_FIREBASE_ID_TOKEN`

#### Production Environment

- `base_url`: `https://us-central1-nerd-word-cfda3.cloudfunctions.net/api`
- `auth_token`: `YOUR_FIREBASE_ID_TOKEN`

### Sample Requests

#### 1. Get All Words

- **Method:** GET
- **URL:** `{{base_url}}/words`

#### 2. Get Specific Word

- **Method:** GET
- **URL:** `{{base_url}}/words/APPLE`

#### 3. Get Today's Puzzle

- **Method:** GET
- **URL:** `{{base_url}}/daily-puzzle/today`

#### 4. Submit Puzzle Result

- **Method:** POST
- **URL:** `{{base_url}}/puzzle-result`
- **Headers:** `Authorization: Bearer {{auth_token}}`
- **Body:** (Use the JSON example from the endpoint reference above)

#### 5. Get Puzzle History

- **Method:** GET
- **URL:** `{{base_url}}/puzzle-history`
- **Headers:** `Authorization: Bearer {{auth_token}}`

## Testing Scenarios

### Basic Functionality Tests

1. **Test Public Endpoints**

   - Verify `/words` returns word list
   - Test `/words/:id` with valid and invalid IDs
   - Check `/daily-puzzle/today` returns current puzzle

2. **Test Authentication**

   - Try authenticated endpoints without token (should return 401)
   - Test with invalid token (should return 401)
   - Test with valid token (should succeed)

3. **Test Data Validation**
   - Submit puzzle result with missing fields
   - Try invalid date formats
   - Test with malformed JSON

### Edge Cases

1. **Duplicate Submissions**

   - Submit the same puzzle result twice (should return 409)

2. **Invalid Word IDs**

   - Request non-existent words
   - Test case sensitivity

3. **Date Boundary Testing**
   - Request puzzles for dates without puzzles
   - Test with invalid date formats

### Performance Testing

1. **Cache Testing**

   - Make multiple requests to `/words` to test caching
   - Verify cache headers and response times

2. **Large Dataset Testing**
   - Test with users who have many puzzle results
   - Verify pagination if implemented

## Troubleshooting

### Common Issues

#### 401 Unauthorized

- **Cause:** Missing or invalid Firebase ID token
- **Solution:** Ensure you're including a valid `Authorization: Bearer <token>` header

#### 404 Not Found

- **Cause:** Invalid endpoint URL or missing resource
- **Solution:** Check the URL path and ensure the resource exists

#### 409 Conflict

- **Cause:** Trying to create a resource that already exists
- **Solution:** Check if the puzzle result or daily puzzle already exists

#### 500 Internal Server Error

- **Cause:** Server-side error
- **Solution:** Check Firebase Functions logs:
  ```bash
  firebase functions:log --project nerd-word-cfda3
  ```

### CORS Issues

If testing from a web interface, ensure your origin is included in the CORS configuration:

```javascript
// Current allowed origins in index.ts
const corsOptions = {
  origin: [
    "http://localhost:8081",
    "http://localhost:19006",
    "exp://localhost:19000",
    "https://nerd-word-cfda3.web.app",
    "https://nerd-word-cfda3.firebaseapp.com",
    "https://nerd-word.expo.app",
    /^https:\/\/nerd-word--[a-z0-9]+\.expo\.app$/,
  ],
};
```

### Debugging Tips

1. **Check Function Logs**

   ```bash
   firebase functions:log --project nerd-word-cfda3
   ```

2. **Test with Emulator UI**

   - Visit `http://localhost:4000` when emulators are running
   - View Firestore data and function logs

3. **Verify Firestore Rules**

   - Ensure your authentication allows the operations you're testing

4. **Network Inspection**
   - Use browser dev tools or Yaak's network inspection
   - Check request/response headers and body

## Security Considerations

- **Never commit real Firebase ID tokens** to version control
- **Use test users** for development and testing
- **Be cautious with production testing** - use separate test projects when possible
- **Rotate tokens regularly** in production environments

## Related Documentation

- [Development Guide](./development-guide.md)
- [Development Modes](./development-modes.md)
- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
