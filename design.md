# Design: AI Cloud Mentor for AWS Developers

## 1. System Overview

The AI Cloud Mentor is a serverless web application that leverages Amazon Bedrock to provide intelligent feedback on AWS architecture descriptions. The system accepts natural language descriptions of AWS architectures, analyzes them using AI, and returns structured recommendations with learning-focused explanations.

**Core Components:**
- **Frontend**: React-based single-page application (SPA)
- **Backend**: AWS Lambda functions behind API Gateway
- **AI Layer**: Amazon Bedrock with Claude 3 model
- **Infrastructure**: Serverless AWS services (Lambda, API Gateway, S3, CloudFront)

**Key Design Principles:**
- Serverless-first for minimal operational overhead
- Stateless architecture for simplicity
- Cost-optimized for hackathon and demo usage
- Security by default with AWS best practices
- Fast iteration and deployment

## 2. High-Level Architecture

### 2.1 Architecture Diagram (Conceptual)

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                         │
│                    (React SPA Frontend)                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Amazon CloudFront                         │
│                   (CDN + Static Hosting)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ↓ Static Assets                   ↓ API Requests
┌───────────────┐              ┌─────────────────────────┐
│   Amazon S3   │              │   Amazon API Gateway    │
│ (Static Site) │              │    (REST API)           │
└───────────────┘              └──────────┬──────────────┘
                                          │
                                          ↓
                              ┌─────────────────────────┐
                              │     AWS Lambda          │
                              │  (Analysis Function)    │
                              └──────────┬──────────────┘
                                         │
                                         ↓
                              ┌─────────────────────────┐
                              │   Amazon Bedrock        │
                              │  (Claude 3 Sonnet)      │
                              └─────────────────────────┘
```

### 2.2 Frontend (Web UI)

**Technology Stack:**
- React 18+ with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Axios for HTTP requests

**Key Components:**

- **ArchitectureInput**: Text area with example prompts and validation
- **AnalysisResults**: Displays categorized findings with severity indicators
- **RecommendationCard**: Expandable cards showing issues and explanations
- **LoadingState**: Progress indicator during analysis
- **ErrorBoundary**: Graceful error handling and user feedback

**State Management:**
- React hooks (useState, useEffect) for local state
- No global state management needed for hackathon scope
- Session storage for analysis history (optional)

**Hosting:**
- Static files built and deployed to S3
- CloudFront distribution for global CDN
- Custom domain with HTTPS (optional)

### 2.3 Backend (API Service)

**Technology Stack:**
- AWS Lambda (Node.js 20.x runtime)
- API Gateway (REST API)
- IAM roles for service permissions
- CloudWatch for logging

**Lambda Functions:**

**Function 1: AnalyzeArchitecture**
- **Purpose**: Process architecture description and return AI analysis
- **Runtime**: Node.js 20.x
- **Memory**: 512 MB
- **Timeout**: 30 seconds
- **Trigger**: API Gateway POST /analyze
- **Environment Variables**:
  - `BEDROCK_REGION`: AWS region for Bedrock
  - `BEDROCK_MODEL_ID`: Model identifier (e.g., anthropic.claude-3-sonnet-20240229-v1:0)
  - `LOG_LEVEL`: Logging verbosity

**API Gateway Configuration:**
- REST API (not HTTP API for simplicity)
- CORS enabled for frontend domain
- Request validation enabled
- Throttling: 10 requests/second, 100 burst
- API key optional (can add for demo control)

### 2.4 AI Layer (Amazon Bedrock)

**Model Selection:**
- **Primary**: Claude 3 Sonnet (anthropic.claude-3-sonnet-20240229-v1:0)
- **Rationale**: Balance of performance, cost, and AWS knowledge
- **Fallback**: Claude 3 Haiku for cost optimization if needed

**Bedrock Configuration:**
- Model access enabled in AWS region (us-east-1 or us-west-2)
- IAM permissions for bedrock:InvokeModel
- Request/response logging to CloudWatch

**Model Parameters:**
- Temperature: 0.3 (lower for consistent, factual responses)
- Max tokens: 4096 (sufficient for detailed analysis)
- Top P: 0.9
- Stop sequences: None

## 3. Data Flow

### 3.1 Analysis Request Flow

```
1. User enters architecture description in frontend
   ↓
2. Frontend validates input (non-empty, length check)
   ↓
3. POST request to API Gateway /analyze endpoint
   {
     "architectureDescription": "string",
     "userId": "optional-session-id"
   }
   ↓
4. API Gateway validates request and invokes Lambda
   ↓
5. Lambda function:
   a. Sanitizes input
   b. Constructs prompt for Bedrock
   c. Calls Bedrock InvokeModel API
   d. Parses AI response
   e. Structures findings into categories
   ↓
6. Lambda returns structured response to API Gateway
   ↓
7. API Gateway returns response to frontend
   {
     "analysisId": "uuid",
     "findings": [...],
     "summary": {...},
     "timestamp": "ISO-8601"
   }
   ↓
8. Frontend displays results in categorized view
```

### 3.2 Error Flow

```
Error occurs at any step
   ↓
Lambda/API Gateway catches error
   ↓
Returns structured error response
   {
     "error": "error-code",
     "message": "user-friendly message",
     "details": "technical details (dev mode only)"
   }
   ↓
Frontend displays error with recovery options
```

## 4. API Design

### 4.1 Endpoint: POST /analyze

**Purpose**: Analyze AWS architecture description

**Request:**
```json
{
  "architectureDescription": "string (required, 10-2000 chars)",
  "sessionId": "string (optional, for tracking)"
}
```

**Response (Success - 200):**
```json
{
  "analysisId": "uuid-v4",
  "timestamp": "2026-02-06T10:30:00Z",
  "summary": {
    "totalFindings": 5,
    "criticalCount": 1,
    "highCount": 2,
    "mediumCount": 2,
    "lowCount": 0
  },
  "findings": [
    {
      "id": "finding-1",
      "severity": "critical|high|medium|low",
      "category": "security|cost|performance|reliability|operational",
      "title": "Brief issue description",
      "description": "Detailed explanation of the issue",
      "impact": "What happens if not addressed",
      "recommendation": "Specific action to take",
      "learningContext": "Why this matters and educational context",
      "resources": [
        {
          "title": "AWS Documentation Link",
          "url": "https://..."
        }
      ]
    }
  ],
  "architectureSummary": "AI's understanding of the described architecture"
}
```

**Response (Error - 4xx/5xx):**
```json
{
  "error": "INVALID_INPUT|BEDROCK_ERROR|TIMEOUT|INTERNAL_ERROR",
  "message": "User-friendly error message",
  "timestamp": "2026-02-06T10:30:00Z"
}
```

**Status Codes:**
- 200: Success
- 400: Invalid input (validation failed)
- 429: Rate limit exceeded
- 500: Internal server error
- 503: Bedrock service unavailable
- 504: Request timeout

### 4.2 Endpoint: GET /health (Optional)

**Purpose**: Health check for monitoring

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-06T10:30:00Z",
  "version": "1.0.0"
}
```

## 5. AI Workflow and Prompting Strategy

### 5.1 Prompt Engineering

**Prompt Structure:**

```
System Context:
You are an AWS Cloud Architecture Mentor helping developers learn best practices.
Your role is to analyze architecture descriptions and provide educational feedback.

Task:
Analyze the following AWS architecture description and identify issues related to:
- Security vulnerabilities
- Cost optimization opportunities
- Performance bottlenecks
- Reliability concerns
- Operational excellence gaps

User Architecture Description:
{architectureDescription}

Instructions:
1. First, summarize your understanding of the architecture
2. Identify specific issues with severity levels (critical, high, medium, low)
3. For each issue, provide:
   - Clear description of the problem
   - Why it matters (impact)
   - Specific recommendation to fix it
   - Educational context (learning explanation)
   - Relevant AWS documentation links

4. Categorize findings by: Security, Cost, Performance, Reliability, Operational Excellence

5. Format your response as valid JSON matching this schema:
{
  "architectureSummary": "string",
  "findings": [
    {
      "severity": "critical|high|medium|low",
      "category": "security|cost|performance|reliability|operational",
      "title": "string",
      "description": "string",
      "impact": "string",
      "recommendation": "string",
      "learningContext": "string",
      "resources": [{"title": "string", "url": "string"}]
    }
  ]
}

Focus on being educational and helpful, not just critical. Explain the "why" behind each recommendation.
```

### 5.2 Response Parsing

**Lambda Processing Steps:**
1. Extract JSON from Bedrock response (handle markdown code blocks if present)
2. Validate JSON structure against expected schema
3. Sanitize any potentially unsafe content
4. Add metadata (analysisId, timestamp, summary counts)
5. Return structured response

**Fallback Handling:**
- If JSON parsing fails, attempt to extract findings from text
- If extraction fails, return generic error with partial results
- Log parsing failures for prompt improvement

### 5.3 Prompt Optimization

**Techniques:**
- Few-shot examples in prompt (optional, if needed)
- Explicit JSON schema in instructions
- Temperature tuning for consistency
- Token limit management (truncate long inputs if needed)

## 6. Security Considerations

### 6.1 Input Validation

**Frontend Validation:**
- Length limits (10-2000 characters)
- Non-empty check
- Basic sanitization (trim whitespace)

**Backend Validation:**
- Strict input validation in Lambda
- Reject requests with suspicious patterns
- Rate limiting per IP/session
- Input sanitization before Bedrock call

### 6.2 API Security

**Authentication & Authorization:**
- API Gateway with API keys (optional for hackathon)
- CORS restricted to frontend domain
- No user authentication required for prototype

**Data Protection:**
- HTTPS only (enforced by CloudFront/API Gateway)
- No persistent storage of user inputs
- Temporary data in Lambda memory only
- CloudWatch logs sanitized (no sensitive data)

### 6.3 AWS IAM Permissions

**Lambda Execution Role:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel"
      ],
      "Resource": "arn:aws:bedrock:*::foundation-model/anthropic.claude-3-sonnet-*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

**Principle of Least Privilege:**
- Lambda only has Bedrock invoke and CloudWatch logs permissions
- No access to other AWS services
- Scoped to specific Bedrock models

### 6.4 Secrets Management

**Environment Variables:**
- Non-sensitive config in Lambda environment variables
- No hardcoded credentials
- AWS SDK uses IAM role credentials automatically

## 7. Scalability Considerations

### 7.1 Serverless Scaling

**Lambda Auto-Scaling:**
- Concurrent execution limit: 10 (hackathon), 100+ (production)
- Reserved concurrency: Not needed for prototype
- Provisioned concurrency: Not needed (cold starts acceptable)

**API Gateway Throttling:**
- Account-level: 10 requests/second
- Burst: 100 requests
- Per-client throttling: Optional with API keys

### 7.2 Cost Management

**Estimated Costs (Hackathon Demo):**
- Lambda: ~$0.20 per 1M requests (minimal for demo)
- API Gateway: ~$3.50 per 1M requests (minimal for demo)
- Bedrock: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- S3 + CloudFront: <$1 for static hosting
- **Total**: <$10 for entire hackathon demo period

**Cost Controls:**
- Request throttling limits
- Lambda timeout (30s max)
- CloudWatch log retention (7 days)
- No data storage costs

### 7.3 Performance Optimization

**Frontend:**
- Code splitting and lazy loading
- Minified production builds
- CloudFront caching for static assets
- Gzip compression

**Backend:**
- Lambda warm-up strategies (optional)
- Efficient Bedrock API calls (single call per analysis)
- Minimal dependencies in Lambda package
- Async/await for non-blocking operations

**Caching Strategy (Future):**
- Cache common architecture patterns
- DynamoDB for response caching (not in prototype)
- CloudFront caching for API responses (careful with dynamic content)

## 8. Error Handling

### 8.1 Error Categories

**Client Errors (4xx):**
- `INVALID_INPUT`: Validation failed (empty, too long, invalid format)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `MALFORMED_REQUEST`: Invalid JSON or missing required fields

**Server Errors (5xx):**
- `BEDROCK_ERROR`: Bedrock API failure
- `TIMEOUT`: Request exceeded 30-second limit
- `INTERNAL_ERROR`: Unexpected Lambda error
- `SERVICE_UNAVAILABLE`: Bedrock temporarily unavailable

### 8.2 Error Handling Strategy

**Lambda Error Handling:**
```javascript
try {
  // Validate input
  validateInput(event.body);
  
  // Call Bedrock
  const bedrockResponse = await invokeBedrockModel(prompt);
  
  // Parse and structure response
  const analysis = parseBedrockResponse(bedrockResponse);
  
  return {
    statusCode: 200,
    body: JSON.stringify(analysis)
  };
  
} catch (error) {
  console.error('Analysis error:', error);
  
  if (error instanceof ValidationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'INVALID_INPUT',
        message: error.message
      })
    };
  }
  
  if (error instanceof BedrockError) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'BEDROCK_ERROR',
        message: 'AI service temporarily unavailable'
      })
    };
  }
  
  // Generic error
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    })
  };
}
```

**Frontend Error Handling:**
- Display user-friendly error messages
- Provide retry option for transient errors
- Show example inputs on validation errors
- Log errors to console for debugging

### 8.3 Monitoring and Logging

**CloudWatch Metrics:**
- Lambda invocations, errors, duration
- API Gateway request count, latency, errors
- Custom metrics: Bedrock call success rate

**CloudWatch Logs:**
- Structured logging (JSON format)
- Log levels: ERROR, WARN, INFO, DEBUG
- Sanitize logs (no user data in production)

**Alarms (Optional for Hackathon):**
- Lambda error rate > 5%
- API Gateway 5xx errors > 10
- Lambda duration > 25 seconds

## 9. Future Enhancements

### 9.1 Short-Term Improvements (Post-Hackathon)

**Enhanced Analysis:**
- Support for architecture diagrams (image upload)
- Multi-turn conversation for clarification
- Comparison of multiple architecture versions
- Cost estimation integration

**User Experience:**
- User accounts and authentication (Cognito)
- Save and retrieve past analyses (DynamoDB)
- Share analysis results via link
- Export to PDF or Markdown

**Performance:**
- Response caching with DynamoDB
- Streaming responses for faster perceived performance
- Parallel analysis of complex architectures

### 9.2 Medium-Term Enhancements

**Advanced Features:**
- Visual architecture diagram generation
- Integration with AWS Organizations for real account analysis
- Automated CloudFormation/Terraform generation
- Architecture templates library
- Community-contributed patterns

**AI Improvements:**
- Fine-tuned models on AWS best practices
- Multi-model approach (different models for different pillars)
- Confidence scores for recommendations
- Interactive Q&A about architecture

**Scalability:**
- Multi-region deployment
- Advanced caching strategies
- Batch analysis capabilities
- API rate limiting per user

### 9.3 Long-Term Vision

**Enterprise Features:**
- Team collaboration and sharing
- Custom organizational policies
- Compliance framework mapping (HIPAA, PCI-DSS)
- Integration with CI/CD pipelines
- Real-time monitoring and alerts

**Ecosystem Integration:**
- AWS Marketplace listing
- Integration with AWS Console
- Third-party tool integrations
- Public API for developers
- Mobile applications

**Advanced AI:**
- Proactive architecture suggestions
- Automated remediation scripts
- Predictive cost and performance modeling
- Natural language to infrastructure-as-code
- Continuous learning from user feedback

---

**Document Version:** 1.0  
**Last Updated:** February 6, 2026  
**Status:** Draft - Ready for Review  
**Dependencies:** requirements.md
