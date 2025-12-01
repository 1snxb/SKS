// This file is SAFE to put on GitHub because it does NOT contain the keys.
// The keys are stored in Netlify's private settings (SECRET_VALID_KEYS).

exports.handler = async (event, context) => {
    // 1. SECURELY LOAD KEYS from the Netlify Environment Variable
    // The value of SECRET_VALID_KEYS (e.g., "KEY1,KEY2,KEY3") is injected here at runtime.
    const secretKeysString = process.env.SECRET_VALID_KEYS;

    // Convert the comma-separated string into a usable array of keys
    const VALID_KEYS = secretKeysString 
        ? secretKeysString.split(',').map(key => key.trim()) 
        : []; 

    // 2. Get the key the user entered from the URL query (e.g., ?key=USERKEY)
    const enteredKey = event.queryStringParameters.key;

    // 3. Set standard headers for allowing external scripts (like your Roblox script)
    const headers = {
        'Access-Control-Allow-Origin': '*', 
        'Content-Type': 'application/json'
    };

    // 4. Validate the key
    if (!enteredKey) {
        return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ valid: false, error: "No key provided" }),
        };
    }

    const isValid = VALID_KEYS.includes(enteredKey.trim()); 

    // 5. Return the result
    return {
        statusCode: isValid ? 200 : 401, // 200 for success, 401 for unauthorized
        headers,
        body: JSON.stringify({ valid: isValid }),
    };
};