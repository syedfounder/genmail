# App Flow Document for Genmail

## Onboarding and Sign-In/Sign-Up

When a new visitor arrives at the Genmail website, they land on a dark-themed landing page with a prominent "Generate Inbox" button. Free users do not need to sign up or provide personal details—they simply click the button and instantly receive a disposable email address displayed on screen.

For users who wish to subscribe to the Private Vault plan, clicking the "Upgrade" link in the header or the subtle banner during free usage opens a custom subscription form. In this form, the user selects a monthly or annual plan and enters their email address, along with a password (or chooses magic-link authentication via Clerk). The same form securely collects payment details using Stripe Elements, allowing the user to enter their credit card information directly.

Upon submitting the form, the following process occurs:

- The app first tokenizes the payment details with Stripe and temporarily stores the payment token and selected plan.
- Clerk initiates the sign-up process, sending an email verification code or magic link to the user.
- The user verifies their email address by entering the code or clicking the link.
- Once verified, a webhook is triggered from Clerk to the backend, which uses the Stripe SDK to create the customer, attach the payment method, and activate the subscription in Stripe.
- The user's subscription status is synced back to Clerk, updating their profile metadata.
- As soon as processing is complete, the user is automatically signed in and redirected to their Private Inbox Dashboard, where all premium features are unlocked.

Signing out is available via a profile icon in the dashboard header. If a user forgets their password, they can click "Forgot Password" on the sign-in screen to receive a reset link from Clerk.

## Main Dashboard or Home Page

Upon logging in as a subscriber, the user sees the Private Inbox Dashboard framed by a sidebar and a top navigation bar. The sidebar contains links to the dashboard's main sections: All Inboxes, Analytics, Account Settings, and Support. The header displays the user's account avatar and a sign-out button. The central area lists each active and expired mailbox, showing its custom label, email address, creation timestamp, and remaining time before auto-destruct. Quick-action buttons appear next to each mailbox for viewing messages, downloading emails, and opening mailbox settings. A Floating Action Button at the bottom right corner lets subscribers create a new mailbox. Free users, by contrast, remain on the landing page with only the "Generate Inbox" button and a real-time email viewer below it once an inbox is created.

## Detailed Feature Flows and Page Transitions

When a free visitor clicks "Generate Inbox," the UI transitions to reveal a large, read-only field showing the new email address above a countdown timer set to ten minutes. Directly below, the Real-Time Email Viewer pane awaits incoming messages and updates instantly via Supabase Realtime. If an email arrives, it appears in the viewer with inline images or attachments rendered according to the free plan limits. Attachments up to 10MB can be downloaded or previewed inline, and obvious spam is filtered out. As the timer ticks downward, the interface subtly shifts color to alert the user of the impending auto-destruct. When time expires, all data vanishes, an informational banner confirms deletion, and the screen resets to the original landing page state.

Subscribers navigate within the dashboard by clicking the "New Mailbox" button. This opens a slide-over panel where they enter a custom label, choose a password for the mailbox, and select a time-to-live of ten minutes, one hour, or twenty-four hours. Upon confirmation, the new mailbox appears in the list and the user can click its "View" button to open a mailbox-specific viewer that functions like the free version but with expanded 25MB attachment support and additional allowed file types. Within that view, users can download individual emails as .eml or .txt before the mailbox expires. From this same view they access a tab that will later host forwarding rules; for now, it either shows "Coming Soon" or instructs them how to verify external addresses. Setting up a custom domain is done by clicking "DNS Setup" in the mailbox settings, which displays the required MX and TXT record values and polls the DNS until verification succeeds.

Behind a separate admin sign-in path, support agents and super admins access the Admin Portal. After authenticating with multi-factor and elevated permissions, they see system health metrics, abuse logs, bounce statistics, and user support tickets. They can view metadata about any user's inboxes, pause or delete problematic mailboxes, and manage subscription records without ever exposing full email content unless the user consents during a support request.

## Settings and Account Management

In the Account Settings section, subscribers can update their email address, change their password, view billing history, and modify their subscription plan. A subpage labeled "Custom Domains" provides step-by-step instructions and a status indicator for any domains they wish to point at Genmail. Once a new domain's DNS records are detected, the custom domain becomes available for mailbox creation. The Settings area also includes a theme toggle that switches between dark, light, and high-contrast modes, and a privacy screen that reminds the user that analytics are anonymized. From any settings page, a "Back to Dashboard" link returns the user to their inbox list.

## Error States and Alternate Paths

If a free user attempts to create more than five inboxes within an hour from the same IP, an error banner appears stating that the rate limit has been reached and suggests waiting or subscribing for higher limits. Connectivity issues in the Real-Time Email Viewer cause a small offline indicator to display, and the interface automatically retries the WebSocket connection until service is restored. When entering the wrong password for a password-protected inbox, the user sees an inline error message prompting reentry, and they may click "Forgot Password" to reset the mailbox password through Clerk. During subscription checkout, failed payment attempts show a descriptive error with steps to correct card details. In the Custom Domain setup, if DNS verification does not detect the correct record within ten minutes, an error message advises the user to double-check their DNS entries and click "Retry."

## Conclusion and Overall App Journey

A casual visitor lands on a sleek dark landing page and generates a free, disposable inbox with a single click, reads their incoming emails in real time, and watches everything disappear after ten minutes. With minimal friction, that same visitor can upgrade to a paid Private Vault plan by creating an account through Clerk, subscribing, and then exploring a full dashboard of multiple, password-protected mailboxes. Subscribers enjoy customizable lifespans, expanded attachment capabilities, download options, and future forwarding rules and custom domain support. Admins operate in a parallel portal focused on system health and user support. Through every step, Genmail delivers a privacy-first, ad-free, and accessible experience that leaves no question about how each page and action connects to the next.
