# Formal Affair — Online Storefront

An editorial e-commerce storefront for **Formal Affair**, a luxury women's formalwear startup I co-founded with my sister. Built with React, TypeScript, and Tailwind CSS.

🔗 **Live site:** [https://www.theformalaffair.com/]  
📷 **Brand community:** [@herweekendhobbies](https://www.instagram.com/herweekendhobbies/)

## About the Project

Formal Affair started as a community-driven brand. My sister built the audience through Instagram, and we successfully sold our first 100+ pieces through social media and word-of-mouth. This storefront represents the next evolution of the business: transitioning from Instagram DMs to a proper, scalable e-commerce experience.

## My Role

As Co-founder and Technical Lead, I handle the digital infrastructure: the website architecture, deployment, UI implementation, and ongoing technical iteration. My sister drives the brand vision, community engagement, and product curation.

## Engineering Approach

My philosophy for this build was to move fast on boilerplate and invest heavy engineering time where it impacts the brand. I scaffolded the initial architecture using Lovable, then spent over two weeks in Cursor heavily rewriting and customizing the application from the ground up:

* **Rebuilt Core UI:** overhauled the cart sidebar, engineered a custom sign-in flow, and rebuilt the product grid for better mobile responsiveness
* **Feature Implementation:** developed the campaign section, integrated the Instagram feed, and built the size guide modal.
* **Design System:** Completely overhauled the styling, layout, typography, and color system to match our premium brand identity.
* **Integrations:** Connected Stripe for payments and integrated Vercel Analytics.

## Tech Stack

* **Frontend:** React, TypeScript, Vite
* **Styling:** Tailwind CSS, shadcn/ui
* **Deployment:** [Vercel / Netlify / etc.]

## Running Locally

To run this project on your local machine:

```bash
# Clone the repository
git clone [https://github.com/Raghavv404/the-formal-affair.git](https://github.com/Raghavv404/the-formal-affair.git)
cd the-formal-affair

# Install dependencies
npm install

# Start the development server
npm run dev
