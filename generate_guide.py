from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

def create_gateway_guide():
    filename = "/app/AI_Gateway_MultiUser_Guide.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph("AI Gateway: Multi-User Collaboration Guide", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph("How to share your AI power safely", styles['Heading2']))
    story.append(Spacer(1, 24))

    # Introduction
    story.append(Paragraph("1. Introduction", styles['Heading3']))
    story.append(Paragraph(
        "Your system is now a 'Multi-User Gateway'. This allows you to invite others to your Discord server "
        "and allow them to use your AI subscriptions (Gemini Ultra, Claude 3.5, etc.) and your hardware "
        "for processing, without compromising your private data.",
        styles['Normal']
    ))
    story.append(Spacer(1, 12))

    # Value Propositions (Advantages)
    story.append(Paragraph("2. Why Use This Gateway? (Advantages)", styles['Heading3']))
    advantages = [
        "<b>Access to Elite AI</b>: Benefit from top-tier subscriptions (Gemini Ultra, Claude 3 Opus) without individual costs.",
        "<b>Hardware-Accelerated Power</b>: Leverage the host's high-performance hardware for complex code generation, data processing, and automation.",
        "<b>Collaborative Sandboxing</b>: Work together on projects in a shared, secure environment where code can be executed and tested in real-time.",
        "<b>Privacy-First Memory</b>: Each user gets a dedicated memory silo. Your private projects and conversation history are never shared with other gateway users.",
        "<b>24/7 Autonomy</b>: Ralph works even when the owner is asleep, processing your queued tasks and monitoring project progress."
    ]
    for adv in advantages:
        story.append(Paragraph(f"• {adv}", styles['Normal']))
    story.append(Spacer(1, 12))

    # Core Features
    story.append(Paragraph("3. Core Technical Features", styles['Heading3']))
    features = [
        "Identitiy Isolation: Each user has their own unique memory file in 'memory/<discord_id>.json'.",
        "Request Queuing: Ralph manages a fair-use queue. If multiple people ask at once, they see their queue position.",
        "Pulse Sharing: When a 'Pulse' is triggered, Ralph checks the shared INBOX.md for collective project goals.",
        "Hardware Lockdown: Users are restricted to the 'clawd' sandbox folder via Docker hardware virtualization."
    ]
    for feature in features:
        story.append(Paragraph(f"• {feature}", styles['Normal']))
    story.append(Spacer(1, 12))

    # User Commands
    story.append(Paragraph("3. Commands for Users", styles['Heading3']))
    data = [
        ["Command", "Description"],
        ["Just Chatting", "Talk naturally to Clawd or Ralph. Memory is isolated per user."],
        ["!task <msg>", "Adds a task to the collective INBOX for the next Heartbeat."],
        ["!status", "Shows the current queue depth and system health."],
        ["!queue", "Shows pending tasks and high-level project goals."]
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.dodgerblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0,0), (-1,-1), 1, colors.black)
    ]))
    story.append(t)
    story.append(Spacer(1, 12))

    # Admin Governance
    story.append(Paragraph("4. Governance & Safety", styles['Heading3']))
    story.append(Paragraph(
        "As the owner, you have exclusive control over the gateway. Use '!lockdown' to immediately stop all services "
        "if you detect suspicious activity. You can also restrict commands to specific 'authorized_users' in 'ralph_config.json'.",
        styles['Normal']
    ))

    doc.build(story)
    print(f"Guide created at {filename}")

if __name__ == "__main__":
    create_gateway_guide()
