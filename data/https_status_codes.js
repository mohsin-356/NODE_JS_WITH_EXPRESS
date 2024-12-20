// HTTP Status Codes with Descriptions

const httpStatusCodes = {
    // 1xx: Informational
    100: "Continue", // Request received, continue with sending the rest
    101: "Switching Protocols", // Server is switching protocols as requested by client
    102: "Processing", // Server has received and is processing the request, no response yet
    103: "Early Hints", // Hints client to start preloading resources
  
    // 2xx: Success
    200: "OK", // Request succeeded, and response content is returned
    201: "Created", // Resource created successfully
    202: "Accepted", // Request received but not yet acted upon
    203: "Non-Authoritative Information", // Meta-information from a different source
    204: "No Content", // Request succeeded, but no content in response
    205: "Reset Content", // Request succeeded, reset the document view
    206: "Partial Content", // Partial content sent as requested by `Range` header
    207: "Multi-Status", // Multiple status codes for different parts of a multi-part message
    208: "Already Reported", // Avoids repeated enumerations of resources
    226: "IM Used", // Server fulfilled request, and content was transformed
  
    // 3xx: Redirection
    300: "Multiple Choices", // Multiple options available for resource
    301: "Moved Permanently", // Resource has been moved to a new URL permanently
    302: "Found", // Resource temporarily moved to a different URL
    303: "See Other", // Resource can be found under a different URI
    304: "Not Modified", // Cached version is up-to-date; no new data
    305: "Use Proxy", // Resource must be accessed through a proxy (deprecated)
    306: "(Unused)", // Previously used, no longer active
    307: "Temporary Redirect", // Temporary redirection to a different URL
    308: "Permanent Redirect", // Permanent redirection, URL updated in bookmarks
  
    // 4xx: Client Errors
    400: "Bad Request", // Request malformed or contains invalid syntax
    401: "Unauthorized", // Authentication required, but missing or invalid
    402: "Payment Required", // Reserved for future use (often experimental)
    403: "Forbidden", // Server refuses to fulfill the request
    404: "Not Found", // Requested resource not found on the server
    405: "Method Not Allowed", // HTTP method not supported by resource
    406: "Not Acceptable", // Content not acceptable per `Accept` headers
    407: "Proxy Authentication Required", // Client must authenticate with proxy
    408: "Request Timeout", // Server timed out waiting for client’s request
    409: "Conflict", // Request conflicts with current state of the resource
    410: "Gone", // Resource permanently removed, no forwarding address
    411: "Length Required", // `Content-Length` header is missing but required
    412: "Precondition Failed", // Preconditions in request headers evaluated as false
    413: "Payload Too Large", // Request entity is too large for server
    414: "URI Too Long", // URI is too long to process
    415: "Unsupported Media Type", // Media type not supported by server
    416: "Range Not Satisfiable", // Range specified in request cannot be fulfilled
    417: "Expectation Failed", // `Expect` header cannot be fulfilled by server
    418: "I'm a teapot", // April Fools' joke from IETF (RFC 2324)
    421: "Misdirected Request", // Request routed to wrong server
    422: "Unprocessable Entity", // Semantically invalid request
    423: "Locked", // Resource is locked
    424: "Failed Dependency", // Previous request failed, affecting this request
    425: "Too Early", // Prevent replay attacks (not yet standardized)
    426: "Upgrade Required", // Client must switch to a different protocol
    428: "Precondition Required", // Requires conditional request headers
    429: "Too Many Requests", // Too many requests in a short period (rate limiting)
    431: "Request Header Fields Too Large", // Headers are too large to process
    451: "Unavailable For Legal Reasons", // Content blocked for legal reasons
  
    // 5xx: Server Errors
    500: "Internal Server Error", // Generic error when no other response fits
    501: "Not Implemented", // Server does not support the requested functionality
    502: "Bad Gateway", // Invalid response from an upstream server
    503: "Service Unavailable", // Server temporarily unable to handle request
    504: "Gateway Timeout", // Timeout waiting for upstream server
    505: "HTTP Version Not Supported", // HTTP version not supported by server
    506: "Variant Also Negotiates", // Circular reference in negotiation
    507: "Insufficient Storage", // Server cannot store representation
    508: "Loop Detected", // Infinite loop detected in server processing
    510: "Not Extended", // Further extensions required for request
    511: "Network Authentication Required" // Client must authenticate to access network
  };
  
  module.exports = httpStatusCodes;
  
// Rarely Encountered HTTP Status Codes

const rareStatusCodes = {
    102: "Processing", // Server has received and is processing the request, no response yet
    103: "Early Hints", // Hints client to start preloading resources
    208: "Already Reported", // Avoids repeated enumerations of resources
    226: "IM Used", // Server fulfilled request, and content was transformed
    305: "Use Proxy", // Resource must be accessed through a proxy (deprecated)
    306: "(Unused)", // Previously used, no longer active
    418: "I'm a teapot", // April Fools' joke from IETF (RFC 2324)
    421: "Misdirected Request", // Request routed to wrong server
    422: "Unprocessable Entity", // Semantically invalid request
    423: "Locked", // Resource is locked
    424: "Failed Dependency", // Previous request failed, affecting this request
    425: "Too Early", // Prevent replay attacks (not yet standardized)
    426: "Upgrade Required", // Client must switch to a different protocol
    428: "Precondition Required", // Requires conditional request headers
    431: "Request Header Fields Too Large", // Headers are too large to process
    451: "Unavailable For Legal Reasons", // Content blocked for legal reasons
    506: "Variant Also Negotiates", // Circular reference in negotiation
    507: "Insufficient Storage", // Server cannot store representation
    508: "Loop Detected", // Infinite loop detected in server processing
    510: "Not Extended", // Further extensions required for request
    511: "Network Authentication Required" // Client must authenticate to access network
  };
  
  module.exports = rareStatusCodes;
  