🧠 AI API Documentation Generator

AI-powered tool that automates the generation of clear, human-readable API field descriptions from JSON input using Google Gemini and AWS Lambda.

🚀 Live Demo

🌐 [Try it now](https://api-doc-generator.vercel.app)

---

Stop wasting hours writing API documentation! Our tool takes your raw JSON data and instantly converts it into clean, understandable documentation using AI — so you can focus on building, not explaining.

---

📌 What It Does

- Accepts a raw JSON schema or object from the user.
- Parses all API fields and generates human-readable descriptions.
- Uses Google Gemini API to generate intelligent, natural language explanations for each field.
- Lets users edit, copy, and download the documentation in JSON or Markdown format.
- Built with accessibility, responsiveness, and dark/light theming in mind.

---

🛠️ How We Built It

Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS + Radix UI
- **Backend**: AWS Lambda (via API Gateway)
- **AI**: Google Gemini 2.0 Flash (via REST API)
- **Storage/Hosting**:
  - **Frontend** hosted on Vercel
  - **Lambda Function** deployed on AWS
  - **Optional EC2** for testing load/local Gemini proxy

---

AWS Lambda – Core Business Logic

We used AWS Lambda to implement the main backend logic for handling AI generation requests. This made our app:

- Serverless – no need to maintain infrastructure.
- Scalable – auto-adjusts to request volume.
- Lightweight – only invoked on request, saving cost.

Lambda Responsibilities:

- Receives JSON fields from the frontend.
- Constructs a natural-language prompt.
- Sends the prompt to Gemini AI API.
- Parses the Gemini response and returns formatted descriptions to the frontend.

AWS API Gateway

- Set up a **POST endpoint** to connect the frontend to the Lambda function.
- Handles CORS and request routing to Lambda.
- Ensures secure, scalable, and cost-effective communication between client and backend.

AWS S3 (Optional)

- Used for hosting static assets (e.g., docs, logo).
- Could also be used to store generated documentation in future versions.

AWS EC2 (Optional)

- For local testing and hosting an alternate Gemini proxy.
- Not essential in final architecture but useful during development.

---

Features

- AI-generated documentation from JSON.
- Editable fields with real-time Markdown preview.
- Download documentation as JSON or Markdown.
- Light and dark themes with modern UI.
- Toast notifications for better UX.

---

What We Learned

- How to integrate AWS Lambda and API Gateway for serverless deployment.
- Prompt engineering techniques for LLMs like Gemini.
- Handling CORS, request validation, and JSON parsing in serverless environments.
- Frontend patterns for live documentation rendering.
- Styling consistency using Radix + Tailwind + shadcn/ui.

---

Challenges We Faced

- **CORS errors** with Lambda and API Gateway integration.
- Lambda function size limits due to bundling `node_modules`.
- Ensuring AI-generated descriptions were accurate and parseable as JSON.
- Frontend UX challenges in editing deeply nested fields.

---

Accomplishments

- Fully working MVP deployed with serverless backend.
- Clean and modern UI/UX ready for developers.
- Achieved high performance scores (Lighthouse/PageSpeed).
- Scalable, extensible architecture for future enhancements.

---

What's Next?

- Add support for OpenAPI (Swagger) schema uploads.
- Enable PDF export of generated documentation.
- Allow team collaboration and shared docs via Supabase.
- Add example values + field constraints in the output.
- Premium tier with bulk upload and branding options.

---

Local Development

```bash
# Clone the repo
git clone https://github.com/your-username/ai-api-doc-generator

# Install dependencies
npm install

# Run locally
npm run dev
