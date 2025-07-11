# BeYou Project Overview

BeYou is a decentralized social media platform designed as a "blockchain-verified life diary." It addresses key challenges of digital identity control and ease of entry into Web3, while focusing on authentic user experiences and user data ownership.

## Vision & Philosophy

- Empowers users to control and monetize their digital memories as NFTs.
- Content is private by default; sharing is always intentional.
- Social interactions occur mainly in small, private "circles" to minimize social pressure.
- Features a unique "authentic moment" concept: users capture daily moments, which are on-chain verifiable within a strict 2-minute window, setting a new standard for genuine content.

## Business Model & Monetization

- **Freemium**: Basic app usage is free, with marketplace fees (e.g., 2.5%) for NFT trades and optional Pro subscriptions.
- **B2B-SaaS**: Brands can run campaigns and access cryptographically verified, user-generated content (Verified UGC).
- Independence from traditional ad-revenue models.

## Product Experience & Architecture

**Two main modes:**
- **Diary Mode**: Default, private-only for trusted friends, no ads, no creator content.
- **Discover Mode**: Optional, public creators, brand content, NFT marketplace, monetization space.
- Users consciously choose between private journaling and public sharing.

**Pragmatic hybrid architecture**: combines the performance of centralized apps with blockchain's immutability— a "exit-resistant Instagram".
- Web3 complexity is fully abstracted away for the user, making onboarding simple and familiar.

## Technology & Implementation

- **Multi-chain architecture**.
- **NFT minting** for moments and user profiles.
- **Smart contract wallet creation and management** via Privy.
- **ZK-proofs and client-side encryption** for privacy.
- **Built with a monorepo**:
  - contracts: Hardhat Ethereum smart contracts
  - backend: Node.js API
  - mobile: React Native app
  - web: Next.js dashboard
- Uses IPFS, PostgreSQL, Redis, OneSignal, WalletConnect, and Dockerized environments.
- Modular structure to support easy scaling and feature extension.

## User Flow

- Simple onboarding: email login triggers creation of secure, non-custodial wallet; memories are minted as NFTs.
- Users can create/join private circles for sharing, or engage with public brand communities by choice.
- Metrics tracked include daily active users, photo capture rate, NFT minting rate, retention, and engagement.

## Key Features

- Authentic moment capture and on-chain timestamping.
- NFT ownership of user content.
- Private circles and public communities.
- Marketplace for content monetization.
- Privacy-first via end-to-end encryption and ZK-proofs.

BeYou combines the addictive "daily moment" of BeReal with true digital ownership, an Instagram-like UX, and cutting-edge privacy for a user-owned social web.
