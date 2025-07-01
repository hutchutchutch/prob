# Supabase Edge Functions CORS Issues

## Problem Description

When calling Supabase Edge Functions from a browser application, you may encounter CORS (Cross-Origin Resource Sharing) errors. These typically manifest as:

```
Ensure CORS request includes only allowed headers
A cross-origin resource sharing (CORS) request was blocked because it contained request headers that were neither CORS-safelisted nor allowed by the Access-Control-Allow-Headers response header.
```

## Common CORS Error Scenarios

### 1. Missing x-request-id Header
The Supabase API client automatically adds an `x-request-id` header for request tracking, but this header is not CORS-safelisted and must be explicitly allowed.

### 2. Missing Authorization Headers
Edge functions often need authorization headers that aren't automatically allowed.

### 3. Preflight Request Handling
OPTIONS requests (preflight) must be handled properly before the actual request.

## Solution

### 1. Update Edge Function CORS Headers

Add comprehensive CORS headers to your edge function:

```typescript
serve(async (req) => {
  // Add CORS headers for browser compatibility
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE'
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Your function logic here
    const result = { message: 'Success' }
    
    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        code: 'ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  }
})
```

### 2. Essential Headers to Include

Always include these headers in `Access-Control-Allow-Headers`:

- `authorization` - For auth tokens
- `x-client-info` - Supabase client information
- `apikey` - Supabase API key
- `content-type` - Request content type
- `x-request-id` - Request tracking (added by API client)

### 3. Deployment and Testing

After updating your edge function:

1. **Deploy the function:**
   ```bash
   supabase functions deploy your-function-name
   ```

2. **Test with curl to verify CORS headers:**
   ```bash
   curl -X OPTIONS "https://your-project.supabase.co/functions/v1/your-function" \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: x-request-id,content-type" \
     -v
   ```

3. **Check response headers include:**
   ```
   Access-Control-Allow-Origin: *
   Access-Control-Allow-Headers: authorization, x-client-info, apikey, content-type, x-request-id
   Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE
   ```

### 4. Debugging CORS Issues

1. **Check browser developer tools:**
   - Look for preflight request failures
   - Verify which headers are being rejected

2. **Check Supabase logs:**
   ```bash
   # Using Supabase CLI
   supabase functions logs your-function-name
   
   # Or check via dashboard
   ```

3. **Test edge function directly:**
   ```bash
   curl -X POST "https://your-project.supabase.co/functions/v1/your-function" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-anon-key" \
     -H "x-request-id: test-123" \
     -d '{"test": "data"}'
   ```

## Post-CORS Fix: 500 Internal Server Error

### Problem Description

After fixing CORS issues, you may encounter 500 Internal Server Error responses. The browser network tab shows:

```
Status Code: 500 Internal Server Error
access-control-allow-headers: authorization, x-client-info, apikey, content-type, x-request-id
access-control-allow-methods: POST, OPTIONS
access-control-allow-origin: *
```

The OPTIONS preflight request succeeds (200), but the actual POST request fails (500).

### Common Causes

1. **Missing Environment Variables**
   - OpenAI API key not set
   - Supabase service role key missing
   - Other required environment variables

2. **Runtime Errors in Function Code**
   - Unhandled exceptions
   - Import/dependency issues
   - Invalid JSON parsing

3. **Timeout Issues**
   - Function taking too long to execute
   - External API calls timing out

4. **Code Structure Issues**
   - Improper async/await handling
   - Missing try-catch blocks
   - Incorrect error response formatting

### Debugging Steps

1. **Check Edge Function Logs:**
   ```bash
   # View recent logs
   supabase functions logs problem-validation --limit 10
   
   # Or use the MCP tool if available
   ```

2. **Look for Short Execution Times:**
   - Very short execution times (< 1000ms) often indicate early failures
   - Environment variable issues typically fail within 100-500ms

3. **Test with Minimal Payload:**
   ```bash
   curl -X POST "https://your-project.supabase.co/functions/v1/problem-validation" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer your-anon-key" \
     -d '{"test": "minimal"}'
   ```

4. **Add Detailed Logging:**
   - Add console.log statements at each step
   - Log function entry, environment variables, request parsing, and API calls
   - Redeploy and test to identify where the failure occurs

### Solution: Robust Error Handling & Logging

The most effective approach is to add comprehensive error handling and logging:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    console.log('Function started')
    
    // Validate environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      console.error('Missing OPENAI_API_KEY')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }
    
    console.log('OpenAI key found, length:', openaiKey.length)
    
    // Validate request body
    let requestData
    try {
      requestData = await req.json()
      console.log('Request data parsed:', Object.keys(requestData))
    } catch (error) {
      console.error('Invalid JSON:', error)
      return new Response(JSON.stringify({ 
        error: { message: 'Invalid request format', code: 'INVALID_JSON' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const { problemInput, projectId } = requestData
    if (!problemInput) {
      return new Response(JSON.stringify({ 
        error: { message: 'problemInput is required', code: 'MISSING_INPUT' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    console.log('Processing problem:', problemInput.substring(0, 50) + '...')

    // Initialize OpenAI
    const openai = new OpenAI({ apiKey: openaiKey })
    console.log('OpenAI client initialized')

    // Call OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a problem analyst. Analyze the problem and respond with JSON."
          },
          {
            role: "user", 
            content: `Analyze: "${problemInput}"\n\nRespond with: {"isValid": boolean, "feedback": "string", "keyTerms": ["term1", "term2"]}`
          }
        ],
        response_format: { type: "json_object" }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout')), 25000)
      )
    ])

    console.log('OpenAI response received')
    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      validatedProblem: analysis.isValid ? problemInput : (analysis.suggestedRefinement || problemInput),
      keyTerms: analysis.keyTerms || [],
      projectId: projectId || crypto.randomUUID(),
      coreProblemId: crypto.randomUUID()
    }

    console.log('Validation complete, isValid:', result.isValid)

    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Function error:', error)
    console.error('Error stack:', error.stack)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
  }
})
```

### Resolution Notes

**Issue Resolved:** After adding comprehensive logging and error handling, the function now works correctly. The 500 error was likely caused by:

1. **Insufficient error handling** in the previous version
2. **Missing logging** that made debugging difficult
3. **Potential async/await issues** in the original code structure

**Key Success Factors:**
- Added step-by-step console logging
- Proper environment variable validation
- Robust error handling with CORS headers in all responses
- Timeout handling for external API calls
- Clear error codes and messages

**Current Status:** Function version 6 is working correctly with 200 responses and ~3-4 second execution times for OpenAI API calls.

### Solution: Environment Variables

1. **Check Required Environment Variables:**
   ```typescript
   // Add environment variable validation
   const openaiKey = Deno.env.get('OPENAI_API_KEY')
   if (!openaiKey) {
     console.error('OPENAI_API_KEY environment variable is required')
     return new Response(JSON.stringify({ 
       error: { message: 'Missing OPENAI_API_KEY', code: 'CONFIG_ERROR' }
     }), { status: 500, headers: corsHeaders })
   }
   ```

2. **Set Environment Variables in Supabase:**
   ```bash
   # Set environment variables
   supabase secrets set OPENAI_API_KEY=your_openai_key_here
   
   # Verify secrets are set
   supabase secrets list
   ```

3. **Add Error Handling for External APIs:**
   ```typescript
   try {
     const completion = await openai.chat.completions.create({
       model: "gpt-4-turbo-preview",
       messages: [/* your messages */]
     })
   } catch (error) {
     console.error('OpenAI API error:', error)
     return new Response(JSON.stringify({ 
       error: { 
         message: 'AI service temporarily unavailable', 
         code: 'AI_SERVICE_ERROR' 
       }
     }), { 
       status: 500, 
       headers: { ...corsHeaders, "Content-Type": "application/json" }
     })
   }
   ```

### Example: Robust Error Handling

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAI } from "https://esm.sh/openai@4"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    // Validate environment variables
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      console.error('Missing OPENAI_API_KEY')
      return new Response(JSON.stringify({ 
        error: { message: 'Service configuration error', code: 'CONFIG_ERROR' }
      }), { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const openai = new OpenAI({ apiKey: openaiKey })
    
    // Validate request body
    let requestData
    try {
      requestData = await req.json()
    } catch (error) {
      console.error('Invalid JSON:', error)
      return new Response(JSON.stringify({ 
        error: { message: 'Invalid request format', code: 'INVALID_JSON' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    const { problemInput } = requestData
    if (!problemInput) {
      return new Response(JSON.stringify({ 
        error: { message: 'problemInput is required', code: 'MISSING_INPUT' }
      }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      })
    }

    console.log('Processing problem:', problemInput)

    // Call OpenAI with timeout
    const completion = await Promise.race([
      openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a problem analyst. Analyze the problem and respond with JSON."
          },
          {
            role: "user", 
            content: `Analyze: "${problemInput}"\n\nRespond with: {"isValid": boolean, "feedback": "string"}`
          }
        ],
        response_format: { type: "json_object" }
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('OpenAI request timeout')), 25000)
      )
    ])

    const analysis = JSON.parse(completion.choices[0].message.content!)
    
    const result = {
      originalInput: problemInput,
      isValid: analysis.isValid,
      validationFeedback: analysis.feedback,
      projectId: crypto.randomUUID()
    }

    console.log('Validation complete:', result.isValid)

    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      }
    })
  }
})
```

## Example: Problem Validation Function

Here's a complete example of a CORS-compliant edge function:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  // Add CORS headers for browser compatibility
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const { problemInput, projectId } = await req.json()
    
    // Your business logic here
    const result = {
      isValid: true,
      feedback: "Problem looks good!",
      projectId: projectId || crypto.randomUUID()
    }
    
    return new Response(JSON.stringify(result), {
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ 
      error: {
        message: error.message,
        code: 'VALIDATION_ERROR'
      }
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        ...corsHeaders
      },
    })
  }
})
```

## Troubleshooting Checklist

- [ ] CORS headers include all required headers (`x-request-id`, `authorization`, etc.)
- [ ] OPTIONS method is handled for preflight requests
- [ ] CORS headers are included in both success and error responses
- [ ] Edge function is deployed after CORS changes
- [ ] Browser cache is cleared after deployment
- [ ] Function logs show successful requests without CORS errors
- [ ] **Environment variables are set (OPENAI_API_KEY, etc.)**
- [ ] **Function doesn't timeout on external API calls**
- [ ] **Request payload validation is implemented**
- [ ] **Error responses include proper CORS headers**

## Best Practices

1. **Always handle OPTIONS requests** for preflight
2. **Include CORS headers in all responses** (success and error)
3. **Test with actual browser requests** not just curl
4. **Use wildcard origin (`*`) for development** but restrict in production
5. **Include comprehensive headers** rather than minimal sets
6. **Check browser developer tools** for specific CORS error details
7. **Validate environment variables** at function startup
8. **Add timeout handling** for external API calls
9. **Log errors clearly** for debugging
10. **Test edge cases** with invalid inputs
