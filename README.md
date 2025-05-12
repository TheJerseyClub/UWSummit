# UWSummit

[![UWSummit Demo Video]](/public/Safari.mp4)

## 👋 Introduction

UWSummit was a dynamic platform where University of Waterloo students could pit their LinkedIn profiles against each other in a friendly "Who's More Cracked?" ELO-based ranking system. Users could vote on matchups, climb the leaderboard, and showcase their achievements.

The platform aimed to create a fun, engaging way for students to see how their profiles stacked up and to discover impressive peers within the Waterloo community.

## 🚀 Milestones & Acquisition

In a whirlwind launch, UWSummit achieved:
*   **1,000+ registered users**
*   **100,000+ site visits**
...all in **under one week!**

Following this rapid growth and community engagement, UWSummit was **acquired by Linkd (YC X25)** and is set to be relaunched soon.

## 🛠️ Tech Stack

UWSummit was built with a modern, scalable tech stack:

*   **Frontend:**
    *   [Next.js](https://nextjs.org/) (React Framework)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Backend & Database:**
    *   [Supabase](https://supabase.io/) (PostgreSQL hosting, Authentication, Realtime features)
*   **API Layer:**
    *   Next.js API Routes
*   **Deployment:**
    *   Likely Vercel (Given the Next.js framework)

## ✨ Features

*   **User Authentication:** Secure sign-up and login with email/password and Google OAuth, managed by Supabase Auth.
*   **Profile Creation:** Users could link their LinkedIn profiles, which were then scraped to populate their UWSummit profile (name, picture, education, experience, accomplishments).
    *   Waterloo affiliation check during profile creation.
    *   Default goose picture for profiles without a LinkedIn photo! 🦆
*   **ELO-Based Voting System:**
    *   Users were presented with two profiles and could vote for "Who's More Cracked?"
    *   ELO scores updated dynamically based on vote outcomes.
    *   Daily vote limits for registered users.
    *   Anonymous users could vote, but their votes didn't affect ELO scores.
*   **Dynamic Leaderboard:**
    *   Displayed top-ranked profiles with ELO scores.
    *   Featured a podium for the top 3 users with unique mountain-themed visuals.
    *   Infinite scroll/load more functionality.
*   **Profile Viewing:** Users could view their own and other users' detailed profiles.
*   **Responsive Design:** Seamless experience across desktop and mobile devices.
*   **Interactive UI:** Animations, loading states, and user feedback messages for a polished experience.

## Getting Started

As the project has been acquired and is awaiting a relaunch, this repository serves as an archive. To explore the codebase:

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/uwsummit.git
    cd uwsummit
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Set up your Supabase instance and add your environment variables (see `.env.local.example` if available).
4.  Run the development server:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

Thank you for visiting UWSummit!

