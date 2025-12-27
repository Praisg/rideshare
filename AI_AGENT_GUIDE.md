# AI Agent Integration Guide

## Overview

Your RIDE admin dashboard now has an **autonomous AI Agent** powered by OpenAI's Agents API (GPT-4). The agent can analyze data, make decisions, and take actions on your behalf.

## Features

### 🤖 What the Agent Can Do

1. **Auto-Process KYC Submissions**
   - Analyzes all pending KYC documents
   - Verifies age, document completeness, and data validity
   - Automatically approves or rejects with reasoning
   - Saves hours of manual review time

2. **Fraud Detection**
   - Analyzes ride patterns for suspicious activity
   - Detects fake accounts and fraudulent behavior
   - Flags high-risk users for manual review
   - Identifies GPS manipulation and cancellation abuse

3. **Platform Analytics**
   - Generates real-time reports on demand
   - Tracks revenue trends and anomalies
   - Monitors user growth and engagement
   - Provides actionable insights

4. **Automated Actions**
   - Approve/reject KYC submissions
   - Flag suspicious users
   - Generate detailed reports
   - Query platform statistics

5. **Conversational Interface**
   - Ask questions in natural language
   - Get instant data-driven answers
   - Multi-turn conversations with context
   - Proactive suggestions

## Setup

### 1. Get OpenAI API Key

```bash
# Sign up at https://platform.openai.com
# Create an API key
# Copy your key (starts with sk-...)
```

### 2. Add to Environment Variables

Edit `/Users/malvin/Desktop/RIDE/server/.env`:

```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Restart Server

```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

## Usage

### Access the Agent

Click the purple sparkle button (✨) in the bottom-right corner of the admin dashboard.

### Quick Actions

#### 1. Auto-Process All KYC
```
Click "Auto-Process All KYC" button
```
The agent will:
- Fetch all pending submissions
- Analyze each document
- Approve valid submissions
- Reject invalid ones with reasons
- Provide summary report

#### 2. Review Pending KYC
```
Ask: "Show me all pending KYC submissions and analyze them"
```

#### 3. Platform Health Check
```
Ask: "Analyze current platform metrics and identify any issues"
```

#### 4. Fraud Detection
```
Ask: "Analyze ride patterns for suspicious activity in the last week"
```

#### 5. Generate Revenue Report
```
Ask: "Generate a detailed revenue report for this month"
```

### Example Conversations

**Conversation 1: KYC Management**
```
You: "How many KYC submissions are pending?"
Agent: "There are 5 pending KYC submissions. Would you like me to review them?"
You: "Yes, analyze all of them"
Agent: [Analyzes all 5, provides recommendations]
You: "Approve the valid ones"
Agent: [Approves 3, rejects 2 with reasons]
```

**Conversation 2: Fraud Investigation**
```
You: "Are there any suspicious users I should know about?"
Agent: [Analyzes ride patterns, identifies 2 users with high cancellation rates]
You: "Flag user ABC123 for review"
Agent: [Flags user with reason: "High cancellation rate of 45%"]
```

**Conversation 3: Business Intelligence**
```
You: "What's our revenue trend this month?"
Agent: [Analyzes data] "Revenue is $45,230 this month, up 15% from last month..."
You: "Which vehicle type generates most revenue?"
Agent: "Cab Premium accounts for 40% of total revenue..."
```

## Agent Tools

The agent has access to these functions:

### 1. `get_pending_kyc`
Fetches all KYC submissions awaiting review

### 2. `analyze_kyc_document`
Analyzes a specific KYC submission and recommends action
- Checks name validity
- Verifies ID number format
- Validates age (18+)
- Ensures address completeness

### 3. `approve_kyc`
Approves a KYC submission
- Updates status to "approved"
- Records verification timestamp

### 4. `reject_kyc`
Rejects a KYC submission with reason
- Updates status to "rejected"
- Saves rejection reason for user

### 5. `get_platform_stats`
Returns current platform metrics
- Total users, riders, customers
- Pending KYC count
- Active and completed rides
- Total revenue and platform fee

### 6. `analyze_ride_patterns`
Analyzes rides for fraud detection
- Calculates cancellation rates
- Identifies unusual patterns
- Detects GPS manipulation indicators
- Flags suspicious behavior

### 7. `flag_suspicious_user`
Flags a user for manual review

### 8. `generate_report`
Creates detailed reports
- Revenue reports
- User growth reports
- KYC status reports
- Fraud detection reports

## Agent Capabilities

### Intelligence Features

1. **Context Awareness**
   - Remembers conversation history
   - Maintains thread state
   - Understands follow-up questions

2. **Data Analysis**
   - Statistical analysis
   - Pattern recognition
   - Anomaly detection
   - Trend identification

3. **Decision Making**
   - Risk assessment
   - Approval/rejection logic
   - Prioritization
   - Recommendations

4. **Automation**
   - Batch processing
   - Scheduled tasks
   - Proactive monitoring
   - Alert generation

### Safety Features

1. **Age Verification**
   - Ensures riders are 18+
   - Rejects underage applicants

2. **Document Validation**
   - Checks ID number format
   - Verifies name completeness
   - Ensures address validity

3. **Fraud Detection**
   - High cancellation rate alerts (>30%)
   - Unusual ride pattern detection
   - GPS manipulation indicators
   - Suspicious pricing alerts

## Advanced Usage

### Scheduled Auto-Processing

You can set up cron jobs to run the agent automatically:

```javascript
// Run every hour
*/0 * * * * curl -X POST http://localhost:3000/agent/auto-kyc \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Custom Queries

Ask complex questions:

```
"Show me users with more than 50 rides and rating below 4.5"
"What percentage of riders have approved KYC?"
"Identify top 10 revenue-generating riders this month"
"Find all rides cancelled by customers in the last 24 hours"
```

### Proactive Monitoring

Set up the agent to alert you:

```
"Alert me when platform revenue drops by more than 20%"
"Notify me when pending KYC count exceeds 10"
"Flag any user with more than 5 cancellations in a day"
```

## API Endpoints

### POST /agent/chat
Chat with the AI agent

**Request:**
```json
{
  "message": "Analyze pending KYC submissions",
  "threadId": "thread_abc123" // optional, for conversation continuity
}
```

**Response:**
```json
{
  "success": true,
  "response": "I found 5 pending KYC submissions...",
  "threadId": "thread_abc123"
}
```

### POST /agent/auto-kyc
Run automatic KYC processing

**Request:**
```json
{}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "response": "Processed 5 submissions: 3 approved, 2 rejected...",
    "threadId": "thread_xyz789"
  }
}
```

### GET /agent/suggestions
Get AI-generated platform improvement suggestions

**Response:**
```json
{
  "success": true,
  "suggestions": "Based on analysis, I recommend: 1. Implement dynamic pricing during peak hours..."
}
```

## Cost Estimation

OpenAI pricing (GPT-4 Turbo):
- Input: $0.01 per 1K tokens
- Output: $0.03 per 1K tokens

**Typical costs:**
- Single KYC review: ~$0.02
- Auto-process 10 KYC: ~$0.20
- Platform analysis: ~$0.05
- Daily operations: ~$2-5/day

## Best Practices

### 1. Start with Specific Requests
❌ Bad: "Help me"
✅ Good: "Review all pending KYC and approve the valid ones"

### 2. Provide Context
❌ Bad: "Check user 123"
✅ Good: "Analyze ride patterns for user 123 to detect fraud"

### 3. Review Agent Actions
- Always review auto-approved KYC decisions
- Manually verify flagged users
- Confirm critical actions

### 4. Use for Repetitive Tasks
- Bulk KYC processing
- Daily platform health checks
- Weekly fraud scans
- Monthly reports

### 5. Monitor Agent Performance
- Track approval accuracy
- Review rejection reasons
- Validate fraud detections
- Adjust thresholds as needed

## Troubleshooting

### Agent Not Responding
```bash
# Check OpenAI API key is set
echo $OPENAI_API_KEY

# Restart server
cd /Users/malvin/Desktop/RIDE/server
npm start
```

### "Failed to initialize agent"
- Verify OpenAI API key is valid
- Check you have credits in OpenAI account
- Ensure internet connection

### Agent Makes Wrong Decisions
- Provide more specific instructions
- Review the tool implementations
- Adjust validation logic in `/server/services/aiAgent.js`

### Slow Response Times
- Normal for complex queries (10-30 seconds)
- OpenAI API latency varies
- Consider caching for repeated queries

## Future Enhancements

Planned features:
- [ ] Voice commands
- [ ] Scheduled autonomous runs
- [ ] Multi-agent collaboration
- [ ] Custom tool creation
- [ ] Learning from corrections
- [ ] Email/SMS notifications
- [ ] Webhook integrations
- [ ] Advanced fraud ML models

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` file
   - Rotate keys periodically
   - Use separate keys for dev/prod

2. **Access Control**
   - Only admin users can access agent
   - JWT authentication required
   - Actions are logged

3. **Data Privacy**
   - Agent doesn't store sensitive data permanently
   - OpenAI processes data per their privacy policy
   - Review OpenAI's data usage policy

4. **Action Validation**
   - Critical actions require confirmation
   - Irreversible actions should be reviewed
   - Implement approval workflows

## Support

For issues or questions:
1. Check OpenAI API status
2. Review server logs
3. Test with simple queries first
4. Verify environment variables

## Summary

The AI Agent is now live in your admin dashboard! It can:

✅ Auto-process KYC submissions
✅ Detect fraud and suspicious patterns
✅ Generate insights and reports
✅ Take actions based on analysis
✅ Answer questions about your platform

**Access it via the purple sparkle button (✨) in the bottom-right corner.**

Add your OpenAI API key to `.env` and start automating your admin tasks!

