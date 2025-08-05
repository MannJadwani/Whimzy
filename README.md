# AI Game Builder Platform - Transformation Plan

## 🎯 Project Overview

Transform the existing Razorpay-NextAuth SaaS stack into an AI-powered game builder platform where users can create 2D and 3D games using natural language prompts.

**Core Concept**: Users type prompts like "Create a 2D platformer with a ninja in a neon city" and the AI generates playable games instantly.

## 📋 Current Tech Stack Analysis

### Existing Infrastructure ✅
- **Framework**: Next.js 14.2.7 with TypeScript
- **Authentication**: NextAuth.js with Google & GitHub providers
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Razorpay integration for subscriptions
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React hooks + session management

### Current Database Schema
```sql
User {
  id: String (cuid)
  email: String (unique)
  name: String?
  image: String?
  createdAt: DateTime
  updatedAt: DateTime
  provider: Provider (GOOGLE | GITHUB)
}
```

## 🏗️ Required Tech Stack Additions

### Game Engines & Libraries
```json
{
  "2D Games": {
    "phaser": "^3.70.0",
    "@phaser/phaser3-rex-plugins": "^1.1.87"
  },
  "3D Games": {
    "three": "^0.158.0",
    "@react-three/fiber": "^8.15.11",
    "@react-three/drei": "^9.88.13"
  },
  "AI Integration": {
    "openai": "^4.20.1",
    "@anthropic-ai/sdk": "^0.9.1"
  },
  "Code Generation": {
    "prettier": "^3.1.0",
    "esprima": "^4.0.1",
    "escodegen": "^2.1.0"
  },
  "File Management": {
    "jszip": "^3.10.1",
    "file-saver": "^2.0.5"
  }
}
```

## 🗄️ Database Schema Extensions

### New Models Required

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  image     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  provider  Provider
  
  // New fields
  subscription    Subscription?
  games          Game[]
  apiUsage       ApiUsage[]
  savedPrompts   SavedPrompt[]
}

model Subscription {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  plan        Plan     // FREE, PRO
  status      SubscriptionStatus // ACTIVE, CANCELED, EXPIRED
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Game {
  id          String   @id @default(cuid())
  title       String
  description String?
  prompt      String   // Original user prompt
  gameType    GameType // TWOD, THREED
  gameCode    String   // Generated game code
  assets      GameAsset[]
  isPublic    Boolean  @default(false)
  
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Analytics
  views       Int      @default(0)
  plays       Int      @default(0)
  remixes     Int      @default(0)
}

model GameAsset {
  id       String @id @default(cuid())
  gameId   String
  game     Game   @relation(fields: [gameId], references: [id])
  type     AssetType // IMAGE, AUDIO, MODEL
  url      String
  metadata Json?
}

model ApiUsage {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  endpoint  String   // game-generation, chat, etc
  tokens    Int
  cost      Float
  createdAt DateTime @default(now())
}

model SavedPrompt {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  prompt    String
  category  String?
  createdAt DateTime @default(now())
}

enum Plan {
  FREE
  PRO
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  EXPIRED
}

enum GameType {
  TWOD
  THREED
}

enum AssetType {
  IMAGE
  AUDIO
  MODEL
  SPRITE
}
```

## 🌐 Page Structure & Routes

### 1. Landing Page (`/`) 
**Current**: Basic "Happy Shipping!" homepage
**Transform to**: Hero section with prompt interface

#### Components Needed:
- `HeroSection` - Main prompt input with examples
- `FeaturedGames` - Showcase of popular games
- `HowItWorks` - 3-step process explanation
- `TechnologyShowcase` - Phaser/Three.js demos

### 2. Game Builder (`/builder`) 
**New Page**: Core AI interaction interface

#### Components:
- `GameCanvas` - Live game preview (iframe/embed)
- `ChatInterface` - AI conversation for game iteration
- `GameControls` - Save, export, share buttons
- `CodeViewer` - Optional code inspection
- `PromptHistory` - Session history

### 3. Gallery (`/gallery`)
**New Page**: Public games showcase

#### Components:
- `GameGrid` - Masonry layout of games
- `GameCard` - Preview with play/remix buttons
- `FilterTabs` - 2D/3D, categories, trending
- `SearchBar` - Find specific games

### 4. Profile/Dashboard (`/dashboard`)
**New Page**: User's saved games and settings

#### Components:
- `MyGames` - User's created games
- `UsageStats` - API usage, limits
- `SavedPrompts` - Prompt library
- `Settings` - Account preferences

### 5. Pricing Page (`/pricing`)
**Update Existing**: Game builder focused plans

#### New Plan Structure:
```typescript
const plans = [
  {
    title: "Free",
    price: 0,
    description: "Perfect for trying out the platform",
    features: [
      "5 games per month",
      "Basic 2D games only", 
      "Community gallery access",
      "Standard AI model"
    ],
    limits: {
      gamesPerMonth: 5,
      aiTokens: 10000,
      exportFormats: ["HTML"]
    }
  },
  {
    title: "Pro",
    price: 1999, // ₹19.99
    description: "For serious game creators",
    features: [
      "Unlimited games",
      "2D + 3D games",
      "Priority AI processing",
      "Advanced export options",
      "Private games",
      "Custom assets upload"
    ],
    limits: {
      gamesPerMonth: -1, // unlimited
      aiTokens: 100000,
      exportFormats: ["HTML", "ZIP", "JSON"]
    }
  }
];
```

## 🤖 AI Integration Architecture

### Core AI Services

#### 1. Game Code Generation (`/api/ai/generate`)
```typescript
// Input: Natural language prompt
// Output: Executable game code (Phaser.js or Three.js)

interface GenerateGameRequest {
  prompt: string;
  gameType: '2d' | '3d';
  userId: string;
  sessionId?: string;
}

interface GenerateGameResponse {
  gameCode: string;
  gameId: string;
  assets: GameAsset[];
  metadata: {
    title: string;
    description: string;
    estimatedTokens: number;
  };
}
```

#### 2. Game Iteration (`/api/ai/iterate`)
```typescript
// Input: Existing game + modification request
// Output: Updated game code

interface IterateGameRequest {
  gameId: string;
  message: string; // "Make the player jump higher"
  currentCode: string;
}
```

#### 3. Asset Generation (`/api/ai/assets`)
```typescript
// Input: Asset description
// Output: Generated sprites/models/sounds

interface GenerateAssetRequest {
  description: string;
  type: 'sprite' | 'texture' | 'sound' | 'model';
  style?: string;
}
```

### AI Provider Strategy
1. **Primary**: OpenAI GPT-4 for code generation
2. **Fallback**: Anthropic Claude for complex logic
3. **Assets**: DALL-E 3 for sprites, ElevenLabs for audio

## 🎮 Game Engine Integration

### 2D Games (Phaser.js)
```typescript
// Template Structure
const gameTemplate2D = {
  scenes: ['PreloadScene', 'GameScene'],
  physics: 'arcade',
  assets: {
    sprites: [],
    audio: [],
    tilemaps: []
  },
  gameObjects: {
    player: {},
    enemies: [],
    platforms: [],
    collectibles: []
  }
};
```

### 3D Games (Three.js)
```typescript
// Template Structure  
const gameTemplate3D = {
  scene: 'THREE.Scene',
  camera: 'PerspectiveCamera',
  renderer: 'WebGLRenderer',
  objects: {
    player: {},
    environment: [],
    lighting: [],
    physics: 'cannon-es'
  }
};
```

## 📱 User Experience Flow

### 1. First-Time User Journey
1. **Landing** → See example prompts, try without signup
2. **Demo Generation** → Create simple game in guest mode
3. **Conversion** → Prompt to sign up to save game
4. **Onboarding** → Tutorial on prompt engineering

### 2. Returning User Journey
1. **Dashboard** → View saved games, start new project
2. **Quick Create** → Direct prompt input from dashboard
3. **Iterate** → Continue working on existing games
4. **Share** → Publish to gallery, get feedback

### 3. Pro User Journey
1. **Advanced Features** → 3D games, custom assets
2. **Batch Creation** → Multiple game variations
3. **Export Options** → Professional game files
4. **Analytics** → View game performance stats

## 💰 Monetization Strategy

### Revenue Streams
1. **Subscription Plans** (Primary)
   - Free: 5 games/month, 2D only
   - Pro: Unlimited, 3D + advanced features

2. **Pay-per-Generation** (Future)
   - Premium AI models for complex games
   - High-quality asset generation

3. **Marketplace** (Future)
   - Sell successful games
   - Template marketplace

### Pricing Psychology
- **Free Tier**: Generous enough to create real value
- **Pro Tier**: Priced for hobbyists, not just professionals
- **Usage Tracking**: Transparent AI token consumption

## 🛠️ Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Update database schema with new models
- [ ] Create basic game builder UI layout
- [ ] Implement Phaser.js integration
- [ ] Set up OpenAI API integration
- [ ] Create simple 2D game templates

### Phase 2: Core Features (Week 3-4)
- [ ] Build chat interface for game iteration
- [ ] Implement game preview/play functionality
- [ ] Create game saving and loading system
- [ ] Add basic export capabilities (HTML/ZIP)
- [ ] Update pricing page for game builder plans

### Phase 3: Gallery & Social (Week 5)
- [ ] Build public gallery page
- [ ] Implement game sharing/remixing
- [ ] Add user dashboard with saved games
- [ ] Create game analytics and view tracking

### Phase 4: Advanced Features (Week 6)
- [ ] Add Three.js 3D game support
- [ ] Implement asset generation API
- [ ] Add advanced export options
- [ ] Create prompt suggestion system

### Phase 5: Optimization (Week 7)
- [ ] Performance optimization for game preview
- [ ] Mobile responsiveness improvements
- [ ] Advanced AI prompt engineering
- [ ] Usage analytics and limiting

## 🧪 Technical Considerations

### Performance
- **Game Preview**: Use iframes for security isolation
- **Code Execution**: Sandbox user-generated game code
- **Caching**: Cache generated games for quick replay
- **CDN**: Store game assets on cloud storage

### Security
- **Code Sanitization**: Validate AI-generated code
- **Rate Limiting**: Prevent API abuse
- **User Content**: Moderate published games
- **Data Privacy**: Secure user prompts and games

### Scalability
- **AI Costs**: Monitor token usage carefully
- **Database**: Index frequently queried fields
- **File Storage**: Use cloud storage for game exports
- **Background Jobs**: Queue heavy AI processing

## 📊 Success Metrics

### User Engagement
- Games created per user
- Time spent in builder interface
- Chat messages per game session
- Gallery engagement (views/plays)

### Business Metrics
- Free to Pro conversion rate
- Monthly recurring revenue (MRR)
- Cost per AI generation
- User retention rates

### Technical Metrics
- AI generation success rate
- Average generation time
- Game performance scores
- Export success rates

## 🚀 Launch Strategy

### Beta Launch
1. **Internal Testing** (Week 8)
   - Test with team and friends
   - Fix critical bugs and UX issues

2. **Limited Beta** (Week 9)
   - Invite 50 users for feedback
   - Gather usage patterns and feedback

3. **Public Launch** (Week 10)
   - Launch on Product Hunt
   - Create social media campaign
   - Reach out to game dev communities

### Growth Tactics
- **Content Marketing**: Game creation tutorials
- **Social Proof**: Featured games showcase  
- **Community**: Discord for users to share creations
- **Partnerships**: Integrate with game dev educational platforms

## 📋 File Structure Changes

### New Directories
```
app/
├── builder/                 # Game builder interface
│   ├── page.tsx
│   └── components/
├── gallery/                 # Public games showcase  
│   ├── page.tsx
│   └── components/
├── dashboard/               # User dashboard
│   ├── page.tsx
│   └── components/
├── api/
│   ├── ai/                  # AI generation endpoints
│   │   ├── generate/
│   │   ├── iterate/
│   │   └── assets/
│   ├── games/               # Game CRUD operations
│   └── usage/               # Usage tracking
└── components/
    ├── game/                # Game-related components
    │   ├── GameCanvas.tsx
    │   ├── GameBuilder.tsx
    │   └── GamePreview.tsx
    └── ai/                  # AI interaction components
        ├── ChatInterface.tsx
        └── PromptSuggestions.tsx

lib/
├── ai/                      # AI service integrations
│   ├── openai.ts
│   ├── claude.ts
│   └── templates/
├── game-engines/            # Game engine utilities
│   ├── phaser-utils.ts
│   ├── three-utils.ts
│   └── templates/
└── game-generation/         # Code generation logic
    ├── parser.ts
    ├── generator.ts
    └── validator.ts
```

---

## 🎯 Next Steps

1. **Start with Phase 1** - Update database schema and basic UI
2. **Focus on 2D first** - Get Phaser.js working well before 3D
3. **MVP approach** - Simple prompt → simple game working end-to-end
4. **User feedback** - Test with real users early and often
5. **Iterate quickly** - Weekly deployments with new features

This plan transforms the existing SaaS template into a comprehensive AI game builder platform while leveraging the existing auth, payments, and UI infrastructure.