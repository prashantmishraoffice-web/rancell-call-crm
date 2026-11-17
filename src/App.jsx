import React, { useState, useEffect, useMemo } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneForwarded,
  PhoneOff,
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  GitMerge,
  ShieldCheck,
  Clock,
  Sliders,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Volume2,
  Code,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Tag,
  Globe,
  Headphones,
  Layers,
  Terminal,
  Copy,
  Check,
  Sparkles,
  Settings,
  Eye,
  BarChart3,
  Zap,
  Hash,
  FileText,
  X,
  Sun,
  Moon,
  Radio
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// --- INITIAL MOCK DATA ---

const INITIAL_CAMPAIGNS = [
  {
    id: 'CMP-101',
    name: 'US Auto Insurance - Inbound High Intent',
    vertical: 'Auto Insurance',
    status: 'Active',
    payoutModel: 'Duration >= 90s',
    targetDuration: 90,
    defaultRevenue: 52.00,
    defaultPayout: 38.00,
    dedupeDays: 30,
    callsToday: 418,
    convertedToday: 284,
    revenueToday: 14768,
    payoutToday: 10792,
    ivrEnabled: true,
    ivrPrompts: [
      { key: '1', label: 'Currently Insured (< 3 yrs claims)', tagAdded: 'insured:true', action: 'Route to Tier 1 Waterfall' },
      { key: '2', label: 'Uninsured / SR-22 Needed', tagAdded: 'sr22:true', action: 'Route to Non-Standard Buyers' },
      { key: '9', label: 'Existing Customer / Support', tagAdded: 'intent:support', action: 'Hangup / Polite Deflect' }
    ],
    routingRules: [
      { id: 'R1', priority: 1, tier: 'Tier 1 - Exclusive', weight: 60, buyerId: 'BUY-01', buyerName: 'Allstate Direct Desk (TX/FL/CA)', requiredTags: ['insured:true', 'geo:CA,TX,FL'], revenue: 56.00, capStatus: '38/50 Daily' },
      { id: 'R2', priority: 1, tier: 'Tier 1 - Exclusive', weight: 40, buyerId: 'BUY-02', buyerName: 'Progressive National Inbound', requiredTags: ['insured:true'], revenue: 50.00, capStatus: '112/150 Daily' },
      { id: 'R3', priority: 2, tier: 'Tier 2 - High Risk / Overflow', weight: 100, buyerId: 'BUY-05', buyerName: 'General SR-22 Specialists', requiredTags: ['sr22:true'], revenue: 39.00, capStatus: '24/80 Daily' }
    ]
  },
  {
    id: 'CMP-102',
    name: 'Home Solar Installers - Residential',
    vertical: 'Home Services / Solar',
    status: 'Active',
    payoutModel: 'Duration >= 120s',
    targetDuration: 120,
    defaultRevenue: 85.00,
    defaultPayout: 62.00,
    dedupeDays: 60,
    callsToday: 195,
    convertedToday: 118,
    revenueToday: 10030,
    payoutToday: 7316,
    ivrEnabled: true,
    ivrPrompts: [
      { key: '1', label: 'Homeowner & Electric Bill > $150/mo', tagAdded: 'homeowner:true', action: 'Route to Solar Tier 1' },
      { key: '2', label: 'Renter or Bill < $150/mo', tagAdded: 'homeowner:false', action: 'Reject / End Call' }
    ],
    routingRules: [
      { id: 'R4', priority: 1, tier: 'Tier 1 - Sunbelt Priority', weight: 100, buyerId: 'BUY-03', buyerName: 'SunRun Direct Call Center', requiredTags: ['homeowner:true', 'geo:CA,AZ,NV,FL'], revenue: 85.00, capStatus: '64/75 Daily' }
    ]
  },
  {
    id: 'CMP-103',
    name: 'Medicare Advantage Open Enrollment (65+)',
    vertical: 'Health / Medicare',
    status: 'Active',
    payoutModel: 'Duration >= 90s',
    targetDuration: 90,
    defaultRevenue: 46.00,
    defaultPayout: 33.00,
    dedupeDays: 30,
    callsToday: 512,
    convertedToday: 368,
    revenueToday: 16928,
    payoutToday: 12144,
    ivrEnabled: true,
    ivrPrompts: [
      { key: '1', label: 'Age 64.5+ Enrolled in Parts A & B', tagAdded: 'medicare_ab:true', action: 'Route to Licensed Agents' }
    ],
    routingRules: [
      { id: 'R5', priority: 1, tier: 'Tier 1 - Licensed Floor', weight: 70, buyerId: 'BUY-04', buyerName: 'SelectQuote Senior Health', requiredTags: ['medicare_ab:true'], revenue: 46.00, capStatus: '189/250 Daily' }
    ]
  },
  {
    id: 'CMP-104',
    name: '24/7 Emergency Plumbing & Water Damage',
    vertical: 'Home Emergency',
    status: 'Active',
    payoutModel: 'Duration >= 60s',
    targetDuration: 60,
    defaultRevenue: 95.00,
    defaultPayout: 68.00,
    dedupeDays: 14,
    callsToday: 89,
    convertedToday: 64,
    revenueToday: 6080,
    payoutToday: 4352,
    ivrEnabled: false,
    ivrPrompts: [],
    routingRules: [
      { id: 'R6', priority: 1, tier: 'Direct Dispatch', weight: 100, buyerId: 'BUY-06', buyerName: 'Roto-Rooter National Dispatch', requiredTags: ['emergency:true'], revenue: 95.00, capStatus: '64/100 Daily' }
    ]
  }
];

const INITIAL_BUYERS = [
  {
    id: 'BUY-01',
    name: 'Allstate Direct Desk (TX/FL/CA)',
    number: '+1 (888) 412-9011',
    status: 'Active',
    activeCalls: 7,
    maxConcurrency: 10,
    dailyCalls: 38,
    dailyCap: 50,
    revenuePerCall: 56.00,
    targetDuration: 90,
    allowedStates: ['CA', 'TX', 'FL'],
    requiredTags: ['insured:true'],
    hours: '08:00 - 20:00 EST',
    cvr: 72.4,
    epc: 40.54
  },
  {
    id: 'BUY-02',
    name: 'Progressive National Inbound',
    number: '+1 (800) 928-3310',
    status: 'Active',
    activeCalls: 14,
    maxConcurrency: 20,
    dailyCalls: 112,
    dailyCap: 150,
    revenuePerCall: 50.00,
    targetDuration: 90,
    allowedStates: ['ALL_US'],
    requiredTags: ['insured:true'],
    hours: '24/7',
    cvr: 68.1,
    epc: 34.05
  },
  {
    id: 'BUY-03',
    name: 'SunRun Direct Call Center',
    number: '+1 (877) 550-7652',
    status: 'Active',
    activeCalls: 5,
    maxConcurrency: 8,
    dailyCalls: 64,
    dailyCap: 75,
    revenuePerCall: 85.00,
    targetDuration: 120,
    allowedStates: ['CA', 'AZ', 'NV', 'FL', 'TX'],
    requiredTags: ['homeowner:true'],
    hours: '09:00 - 19:00 PST',
    cvr: 61.5,
    epc: 52.27
  },
  {
    id: 'BUY-04',
    name: 'SelectQuote Senior Health',
    number: '+1 (855) 390-6500',
    status: 'Active',
    activeCalls: 19,
    maxConcurrency: 25,
    dailyCalls: 189,
    dailyCap: 250,
    revenuePerCall: 46.00,
    targetDuration: 90,
    allowedStates: ['ALL_US'],
    requiredTags: ['medicare_ab:true'],
    hours: '08:00 - 21:00 EST',
    cvr: 74.0,
    epc: 34.04
  },
  {
    id: 'BUY-05',
    name: 'General SR-22 Specialists',
    number: '+1 (866) 719-2099',
    status: 'Active',
    activeCalls: 2,
    maxConcurrency: 6,
    dailyCalls: 24,
    dailyCap: 80,
    revenuePerCall: 39.00,
    targetDuration: 90,
    allowedStates: ['CA', 'FL', 'GA', 'OH', 'IL'],
    requiredTags: ['sr22:true'],
    hours: '09:00 - 21:00 EST',
    cvr: 58.2,
    epc: 22.70
  },
  {
    id: 'BUY-06',
    name: 'Roto-Rooter National Dispatch',
    number: '+1 (800) 491-7117',
    status: 'Paused',
    activeCalls: 0,
    maxConcurrency: 12,
    dailyCalls: 64,
    dailyCap: 100,
    revenuePerCall: 95.00,
    targetDuration: 60,
    allowedStates: ['ALL_US'],
    requiredTags: ['emergency:true'],
    hours: '24/7',
    cvr: 79.5,
    epc: 75.52
  }
];

const INITIAL_PUBLISHERS = [
  {
    id: 'PUB-104',
    name: 'Apex Media Meta Ads',
    sourceType: 'Paid Social (FB/IG)',
    didsAssigned: 24,
    primaryDid: '+1 (844) 890-1120',
    payoutModel: 'Dynamic RevShare (72%) / $38 Fixed',
    callsSent: 482,
    billableCalls: 341,
    cvr: 70.7,
    payoutEarned: 13840,
    postbackUrl: 'https://trk.apexmedia.io/postback?cid={click_id}&payout={payout}&txid={call_uuid}'
  },
  {
    id: 'PUB-108',
    name: 'SearchKings Google Call-Only',
    sourceType: 'Google Ads PPC',
    didsAssigned: 40,
    primaryDid: '+1 (888) 301-7745',
    payoutModel: '$42.00 @ 90s Duration',
    callsSent: 395,
    billableCalls: 292,
    cvr: 73.9,
    payoutEarned: 12264,
    postbackUrl: 'https://googleads.g.doubleclick.net/pagead/conversion/?gclid={gclid}&value={payout}'
  },
  {
    id: 'PUB-112',
    name: 'SolarQuote Compare Native',
    sourceType: 'Native / Taboola Lander',
    didsAssigned: 15,
    primaryDid: '+1 (855) 612-9904',
    payoutModel: '$62.00 @ 120s Duration',
    callsSent: 195,
    billableCalls: 118,
    cvr: 60.5,
    payoutEarned: 7316,
    postbackUrl: 'https://trc.taboola.com/actions-handler/log/3/s2s-action?click-id={tb_cid}&revenue={payout}'
  },
  {
    id: 'PUB-119',
    name: 'SeniorBenefits Co-Reg Desk',
    sourceType: 'Warm Transfer / SMS',
    didsAssigned: 8,
    primaryDid: '+1 (833) 700-4512',
    payoutModel: '$33.00 @ 90s Duration',
    callsSent: 142,
    billableCalls: 83,
    cvr: 58.4,
    payoutEarned: 2739,
    postbackUrl: 'https://hooks.seniorbenefits.org/retreaver-webhook?uuid={call_uuid}&status=converted'
  }
];

const INITIAL_CALL_LOGS = [
  {
    id: 'CALL-99482',
    timestamp: 'Just now (Live)',
    callerId: '+1 (310) 892-4419',
    callerCity: 'Los Angeles, CA',
    state: 'CA',
    campaignId: 'CMP-101',
    campaignName: 'US Auto Insurance - Inbound High Intent',
    publisherId: 'PUB-104',
    publisherName: 'Apex Media Meta Ads',
    buyerId: 'BUY-01',
    buyerName: 'Allstate Direct Desk (TX/FL/CA)',
    durationSec: 104,
    targetDuration: 90,
    isLive: true,
    status: 'Converted',
    revenue: 56.00,
    payout: 38.00,
    tags: ['geo:CA', 'insured:true', 'ivr_digit:1', 'utm_source:fb_reels', 'vehicles:2'],
    transcriptSnippet: 'Agent: "Thank you for calling Allstate Direct, I see you are in California looking to compare rates on two vehicles..." Caller: "Yes, my current Geico renewal jumped up $45 a month and I have a clean record..."',
    timeline: [
      { time: '00:00.1', event: 'Inbound Call Initiated on DID +1 (844) 890-1120', detail: 'Caller +13108924419 (Los Angeles, CA)', type: 'info' },
      { time: '00:00.4', event: 'DNI Session Matched (Number Pool #14)', detail: 'Attached tags: utm_source=fb_reels, vehicles=2, click_id=fb_99182a', type: 'tag' },
      { time: '00:01.0', event: 'IVR Prompt Played: "Press 1 if currently insured..."', detail: 'Caller pressed DTMF [1] -> Tag added: insured:true', type: 'ivr' },
      { time: '00:04.2', event: 'Routing Engine Evaluated 3 Buyers', detail: 'Winner: Allstate Direct Desk (TX/FL/CA) [Priority 1, Concurrency 7/10]', type: 'route' },
      { time: '00:06.0', event: 'Buyer Answered (+18884129011)', detail: 'Call bridged cleanly. Duration timer started.', type: 'connect' },
      { time: '01:36.0', event: '90s Connected Duration Threshold Reached!', detail: 'Marked Billable: Revenue +$56.00 | Publisher Payout +$38.00', type: 'convert' },
      { time: '01:36.4', event: 'S2S Conversion Postback Fired (HTTP 200 OK)', detail: 'GET https://trk.apexmedia.io/postback?cid=fb_99182a&payout=38.00', type: 'webhook' }
    ]
  },
  {
    id: 'CALL-99481',
    timestamp: 'Active (48s)',
    callerId: '+1 (480) 519-8821',
    callerCity: 'Phoenix, AZ',
    state: 'AZ',
    campaignId: 'CMP-102',
    campaignName: 'Home Solar Installers - Residential',
    publisherId: 'PUB-112',
    publisherName: 'SolarQuote Compare Native',
    buyerId: 'BUY-03',
    buyerName: 'SunRun Direct Call Center',
    durationSec: 48,
    targetDuration: 120,
    isLive: true,
    status: 'In Progress',
    revenue: 0.00,
    payout: 0.00,
    tags: ['geo:AZ', 'homeowner:true', 'utility:APS', 'bill_est:240'],
    transcriptSnippet: 'Agent: "SunRun Solar Advisor desk, this is Marcus. Let\'s pull up your satellite roof layout in Phoenix..." Caller: "Sounds good, our summer APS bill hit $280 last month."',
    timeline: [
      { time: '00:00.1', event: 'Inbound Call Initiated on DID +1 (855) 612-9904', detail: 'Caller +14805198821 (Phoenix, AZ)', type: 'info' },
      { time: '00:00.5', event: 'DNI Web Session Synced', detail: 'Attached tags: homeowner=true, utility=APS, bill_est=240', type: 'tag' },
      { time: '00:03.1', event: 'Routed to SunRun Direct Call Center', detail: 'Matched geo:AZ & homeowner:true. Waiting for 120s conversion trigger.', type: 'connect' }
    ]
  },
  {
    id: 'CALL-99480',
    timestamp: '4 mins ago',
    callerId: '+1 (786) 332-1904',
    callerCity: 'Miami, FL',
    state: 'FL',
    campaignId: 'CMP-103',
    campaignName: 'Medicare Advantage Open Enrollment (65+)',
    publisherId: 'PUB-108',
    publisherName: 'SearchKings Google Call-Only',
    buyerId: 'BUY-04',
    buyerName: 'SelectQuote Senior Health',
    durationSec: 245,
    targetDuration: 90,
    isLive: false,
    status: 'Converted',
    revenue: 46.00,
    payout: 33.00,
    tags: ['geo:FL', 'medicare_ab:true', 'age:67', 'gclid:EAIaIQobChMI8'],
    transcriptSnippet: 'Agent: "Great news Mrs. Alvarez, in Miami-Dade county that plan includes the dental and grocery card benefit..."',
    timeline: [
      { time: '00:00.1', event: 'Inbound Call Initiated', detail: 'Caller +17863321904 (Miami, FL)', type: 'info' },
      { time: '00:02.8', event: 'IVR Keypress [1] Verified Medicare A&B', detail: 'Tag medicare_ab:true appended', type: 'ivr' },
      { time: '00:05.0', event: 'Bridged to SelectQuote Senior Health', detail: 'Connected in 2.2s ring time', type: 'connect' },
      { time: '01:35.0', event: 'Conversion Triggered @ 90s Duration', detail: 'Revenue $46.00 | Payout $33.00 credited', type: 'convert' },
      { time: '01:35.3', event: 'Google Ads Offline Conversion Webhook Sent', detail: 'HTTP 200 OK (gclid=EAIaIQobChMI8)', type: 'webhook' }
    ]
  },
  {
    id: 'CALL-99479',
    timestamp: '9 mins ago',
    callerId: '+1 (214) 901-3387',
    callerCity: 'Dallas, TX',
    state: 'TX',
    campaignId: 'CMP-101',
    campaignName: 'US Auto Insurance - Inbound High Intent',
    publisherId: 'PUB-104',
    publisherName: 'Apex Media Meta Ads',
    buyerId: 'BUY-01',
    buyerName: 'Allstate Direct Desk (TX/FL/CA)',
    durationSec: 38,
    targetDuration: 90,
    isLive: false,
    status: 'Short Call',
    revenue: 0.00,
    payout: 0.00,
    tags: ['geo:TX', 'insured:true', 'ivr_digit:1'],
    transcriptSnippet: 'Caller: "Oh hold on, my spouse is calling on the other line, let me call you right back with the VIN number."',
    timeline: [
      { time: '00:00.1', event: 'Inbound Call Initiated', detail: 'Caller +12149013387 (Dallas, TX)', type: 'info' },
      { time: '00:04.5', event: 'Connected to Allstate Direct Desk', detail: 'Call lasted 38s (52s short of 90s billable threshold)', type: 'connect' },
      { time: '00:42.5', event: 'Caller Disconnected Early', detail: 'Non-billable: Short Call (< 90s)', type: 'error' }
    ]
  },
  {
    id: 'CALL-99478',
    timestamp: '14 mins ago',
    callerId: '+1 (404) 612-7721',
    callerCity: 'Atlanta, GA',
    state: 'GA',
    campaignId: 'CMP-101',
    campaignName: 'US Auto Insurance - Inbound High Intent',
    publisherId: 'PUB-108',
    publisherName: 'SearchKings Google Call-Only',
    buyerId: 'BUY-05',
    buyerName: 'General SR-22 Specialists',
    durationSec: 162,
    targetDuration: 90,
    isLive: false,
    status: 'Converted',
    revenue: 39.00,
    payout: 28.00,
    tags: ['geo:GA', 'sr22:true', 'ivr_digit:2'],
    transcriptSnippet: 'Agent: "We can file that Georgia SR-22 certificate electronically with the DDS today as soon as we bind the policy..."',
    timeline: [
      { time: '00:00.1', event: 'Inbound Call Initiated', detail: 'Caller +14046127721 (Atlanta, GA)', type: 'info' },
      { time: '00:03.2', event: 'IVR Keypress [2] -> Tag sr22:true', detail: 'Bypassed Tier 1 standard buyers; routed to SR-22 Waterfall', type: 'ivr' },
      { time: '00:06.1', event: 'Connected to General SR-22 Specialists', detail: 'Duration reached 162s', type: 'convert' }
    ]
  },
  {
    id: 'CALL-99477',
    timestamp: '19 mins ago',
    callerId: '+1 (310) 892-4419',
    callerCity: 'Los Angeles, CA',
    state: 'CA',
    campaignId: 'CMP-101',
    campaignName: 'US Auto Insurance - Inbound High Intent',
    publisherId: 'PUB-104',
    publisherName: 'Apex Media Meta Ads',
    buyerId: 'BUY-01',
    buyerName: 'Allstate Direct Desk (TX/FL/CA)',
    durationSec: 112,
    targetDuration: 90,
    isLive: false,
    status: 'Duplicate',
    revenue: 0.00,
    payout: 0.00,
    tags: ['geo:CA', 'insured:true', 'dedupe_match:30d'],
    transcriptSnippet: 'Repeat caller within 30-day deduplication window. Routed to original buyer without double-billing affiliate.',
    timeline: [
      { time: '00:00.1', event: 'Repeat Caller Detected (+13108924419)', detail: 'Previously converted within 30-day dedupe window', type: 'error' },
      { time: '00:02.0', event: 'Sticky-Routed to Allstate Direct Desk', detail: 'Payout suppressed ($0.00 Duplicate protection)', type: 'route' }
    ]
  }
];

const HOURLY_CHART_DATA = [
  { hour: '08:00', totalCalls: 42, convertedCalls: 28, revenue: 1490 },
  { hour: '09:00', totalCalls: 78, convertedCalls: 54, revenue: 2860 },
  { hour: '10:00', totalCalls: 124, convertedCalls: 89, revenue: 4820 },
  { hour: '11:00', totalCalls: 165, convertedCalls: 118, revenue: 6490 },
  { hour: '12:00', totalCalls: 148, convertedCalls: 102, revenue: 5610 },
  { hour: '13:00', totalCalls: 172, convertedCalls: 125, revenue: 6980 },
  { hour: '14:00', totalCalls: 190, convertedCalls: 138, revenue: 7720 },
  { hour: '15:00', totalCalls: 168, convertedCalls: 116, revenue: 6410 },
  { hour: '16:00', totalCalls: 127, convertedCalls: 84, revenue: 5426 }
];

const SIMULATED_CALL_TEMPLATES = [
  {
    callerId: '+1 (512) 749-2210',
    callerCity: 'Austin, TX',
    state: 'TX',
    campaignId: 'CMP-101',
    campaignName: 'US Auto Insurance - Inbound High Intent',
    publisherId: 'PUB-104',
    publisherName: 'Apex Media Meta Ads',
    buyerId: 'BUY-01',
    buyerName: 'Allstate Direct Desk (TX/FL/CA)',
    targetDuration: 90,
    revenue: 56.00,
    payout: 38.00,
    tags: ['geo:TX', 'insured:true', 'ivr_digit:1', 'utm_source:fb_lookalike'],
    transcriptSnippet: 'Agent: "Allstate Direct Austin licensed desk, I see you pressed 1 confirming active coverage..."'
  },
  {
    callerId: '+1 (619) 804-5532',
    callerCity: 'San Diego, CA',
    state: 'CA',
    campaignId: 'CMP-102',
    campaignName: 'Home Solar Installers - Residential',
    publisherId: 'PUB-112',
    publisherName: 'SolarQuote Compare Native',
    buyerId: 'BUY-03',
    buyerName: 'SunRun Direct Call Center',
    targetDuration: 120,
    revenue: 85.00,
    payout: 62.00,
    tags: ['geo:CA', 'homeowner:true', 'utility:SDGE', 'roof_shade:none'],
    transcriptSnippet: 'Agent: "Thanks for calling SunRun California, SDG&E rates just went up again so let\'s check your Net Metering battery eligibility..."'
  },
  {
    callerId: '+1 (813) 402-9188',
    callerCity: 'Tampa, FL',
    state: 'FL',
    campaignId: 'CMP-103',
    campaignName: 'Medicare Advantage Open Enrollment (65+)',
    publisherId: 'PUB-108',
    publisherName: 'SearchKings Google Call-Only',
    buyerId: 'BUY-04',
    buyerName: 'SelectQuote Senior Health',
    targetDuration: 90,
    revenue: 46.00,
    payout: 33.00,
    tags: ['geo:FL', 'medicare_ab:true', 'zip:33602'],
    transcriptSnippet: 'Agent: "SelectQuote Senior Benefits, let\'s review the zero-premium plans in Hillsborough County..."'
  }
];

export default function App() {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'campaigns' | 'buyers' | 'publishers' | 'logs'
  const [darkMode, setDarkMode] = useState(true);

  // Core Data State
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [buyers, setBuyers] = useState(INITIAL_BUYERS);
  const [publishers, setPublishers] = useState(INITIAL_PUBLISHERS);
  const [callLogs, setCallLogs] = useState(INITIAL_CALL_LOGS);

  // Interactive Selection & Inspector States
  const [selectedCampaignId, setSelectedCampaignId] = useState('CMP-101');
  const [selectedCall, setSelectedCall] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Filters & Modals
  const [callSearchQuery, setCallSearchQuery] = useState('');
  const [callStatusFilter, setCallStatusFilter] = useState('ALL');
  const [showAddBuyerModal, setShowAddBuyerModal] = useState(false);
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [showRouterSimulatorModal, setShowRouterSimulatorModal] = useState(false);

  // Test Call Router State
  const [simCampaignId, setSimCampaignId] = useState('CMP-101');
  const [simCallerState, setSimCallerState] = useState('CA');
  const [simIvrKey, setSimIvrKey] = useState('1');
  const [simCustomTag, setSimCustomTag] = useState('homeowner:true');
  const [simResult, setSimResult] = useState(null);

  // New Buyer Form State
  const [newBuyerForm, setNewBuyerForm] = useState({
    name: '',
    number: '+1 (800) 555-0199',
    maxConcurrency: 10,
    dailyCap: 100,
    revenuePerCall: 55,
    targetDuration: 90,
    allowedStates: 'CA, TX, FL, NY',
    requiredTags: 'insured:true'
  });

  // New Campaign Form State
  const [newCampaignForm, setNewCampaignForm] = useState({
    name: '',
    vertical: 'Auto Insurance',
    targetDuration: 90,
    defaultRevenue: 55,
    defaultPayout: 40,
    dedupeDays: 30
  });

  // Live Call Tick Timer (increments active calls every second and triggers live conversion at threshold!)
  useEffect(() => {
    const interval = setInterval(() => {
      setCallLogs((prevLogs) =>
        prevLogs.map((call) => {
          if (!call.isLive) return call;
          const nextDuration = call.durationSec + 1;
          const justConverted =
            call.status === 'In Progress' && nextDuration >= call.targetDuration;

          // If a call hits 165 seconds in the demo, let's gracefully complete it
          if (nextDuration >= 165) {
            return {
              ...call,
              durationSec: nextDuration,
              isLive: false,
              timestamp: '1 min ago'
            };
          }

          if (justConverted) {
            const matchedCampaign = campaigns.find((c) => c.id === call.campaignId);
            const rev = matchedCampaign ? matchedCampaign.defaultRevenue : 56.0;
            const pay = matchedCampaign ? matchedCampaign.defaultPayout : 38.0;
            return {
              ...call,
              durationSec: nextDuration,
              status: 'Converted',
              revenue: rev,
              payout: pay,
              timestamp: `Just now (Live ${nextDuration}s)`,
              timeline: [
                ...call.timeline,
                {
                  time: `0${Math.floor(nextDuration / 60)}:${String(nextDuration % 60).padStart(2, '0')}.0`,
                  event: `${call.targetDuration}s Connected Duration Threshold Reached!`,
                  detail: `Marked Billable: Revenue +$${rev.toFixed(2)} | Publisher Payout +$${pay.toFixed(2)}`,
                  type: 'convert'
                },
                {
                  time: `0${Math.floor(nextDuration / 60)}:${String(nextDuration % 60).padStart(2, '0')}.4`,
                  event: 'S2S Conversion Postback Fired (HTTP 200 OK)',
                  detail: `Webhook delivered to ${call.publisherName}`,
                  type: 'webhook'
                }
              ]
            };
          }

          return {
            ...call,
            durationSec: nextDuration,
            timestamp: `Active (${nextDuration}s)`
          };
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [campaigns]);

  // Keep selectedCall synced if it's currently live
  useEffect(() => {
    if (selectedCall) {
      const updated = callLogs.find((c) => c.id === selectedCall.id);
      if (updated) setSelectedCall(updated);
    }
  }, [callLogs, selectedCall]);

  // Derived KPI Metrics
  const kpis = useMemo(() => {
    const activeLiveCount = callLogs.filter((c) => c.isLive).length;
    const totalCallsToday =
      campaigns.reduce((acc, c) => acc + c.callsToday, 0) +
      (callLogs.length - INITIAL_CALL_LOGS.length);
    const convertedToday =
      campaigns.reduce((acc, c) => acc + c.convertedToday, 0) +
      callLogs.filter((c) => c.status === 'Converted').length -
      3;
    const totalRevenue =
      campaigns.reduce((acc, c) => acc + c.revenueToday, 0) +
      callLogs.reduce((acc, c) => acc + c.revenue, 0) -
      141;
    const totalPayout =
      campaigns.reduce((acc, c) => acc + c.payoutToday, 0) +
      callLogs.reduce((acc, c) => acc + c.payout, 0) -
      99;
    const cvr = totalCallsToday > 0 ? ((convertedToday / totalCallsToday) * 100).toFixed(1) : '0.0';
    return {
      activeLiveCount,
      totalCallsToday,
      convertedToday,
      totalRevenue,
      totalPayout,
      netMargin: totalRevenue - totalPayout,
      cvr
    };
  }, [callLogs, campaigns]);

  // Trigger Simulated Incoming Call
  const handleSimulateIncomingCall = () => {
    const template =
      SIMULATED_CALL_TEMPLATES[Math.floor(Math.random() * SIMULATED_CALL_TEMPLATES.length)];
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newCallId = `CALL-${99483 + callLogs.length}`;
    const startSec = 82; // Start near 90s threshold so user sees it convert live within seconds!

    const newCall = {
      id: newCallId,
      timestamp: `Active (${startSec}s)`,
      callerId: template.callerId.slice(0, -4) + randomSuffix,
      callerCity: template.callerCity,
      state: template.state,
      campaignId: template.campaignId,
      campaignName: template.campaignName,
      publisherId: template.publisherId,
      publisherName: template.publisherName,
      buyerId: template.buyerId,
      buyerName: template.buyerName,
      durationSec: startSec,
      targetDuration: 90,
      isLive: true,
      status: 'In Progress',
      revenue: 0.0,
      payout: 0.0,
      tags: template.tags,
      transcriptSnippet: template.transcriptSnippet,
      timeline: [
        {
          time: '00:00.1',
          event: `Inbound Call Received from ${template.callerCity}`,
          detail: `Matched Campaign: ${template.campaignName}`,
          type: 'info'
        },
        {
          time: '00:00.6',
          event: 'DNI Pool Attributes Attached',
          detail: `Tags: ${template.tags.join(', ')}`,
          type: 'tag'
        },
        {
          time: '00:02.4',
          event: 'IVR Qualification Passed',
          detail: 'Caller pressed [1] -> Verified High Intent',
          type: 'ivr'
        },
        {
          time: '00:04.1',
          event: `Routed to ${template.buyerName}`,
          detail: 'Connected! Counting down to 90s conversion threshold...',
          type: 'connect'
        }
      ]
    };

    setCallLogs((prev) => [newCall, ...prev]);
  };

  // Run Smart Call Routing Simulator
  const handleRunRouteSimulation = () => {
    const camp = campaigns.find((c) => c.id === simCampaignId) || campaigns[0];
    const derivedIvrTag =
      simIvrKey === '1'
        ? 'insured:true'
        : simIvrKey === '2'
        ? 'sr22:true'
        : 'intent:support';

    const evaluationSteps = buyers.map((buyer) => {
      if (buyer.status !== 'Active') {
        return { buyer, passed: false, reason: 'Buyer status is Paused' };
      }
      if (buyer.activeCalls >= buyer.maxConcurrency) {
        return {
          buyer,
          passed: false,
          reason: `Concurrency Cap Full (${buyer.activeCalls}/${buyer.maxConcurrency})`
        };
      }
      if (buyer.dailyCalls >= buyer.dailyCap) {
        return {
          buyer,
          passed: false,
          reason: `Daily Cap Reached (${buyer.dailyCalls}/${buyer.dailyCap})`
        };
      }
      const stateMatch =
        buyer.allowedStates.includes('ALL_US') ||
        buyer.allowedStates.includes(simCallerState.toUpperCase());
      if (!stateMatch) {
        return {
          buyer,
          passed: false,
          reason: `Geo Mismatch: Buyer only accepts [${buyer.allowedStates.join(', ')}], caller is ${simCallerState}`
        };
      }
      const combinedCallerTags = [derivedIvrTag, simCustomTag.trim()];
      const tagMatch = buyer.requiredTags.every((req) =>
        combinedCallerTags.some((t) => t.toLowerCase() === req.toLowerCase())
      );
      if (!tagMatch) {
        return {
          buyer,
          passed: false,
          reason: `Missing Required Tag: [${buyer.requiredTags.join(', ')}]`
        };
      }
      return {
        buyer,
        passed: true,
        reason: `Matched Geo (${simCallerState}), Tags (${buyer.requiredTags.join(', ')}), Capacity OK (${buyer.activeCalls}/${buyer.maxConcurrency})`
      };
    });

    const winningEntry = evaluationSteps.find((e) => e.passed);
    setSimResult({
      campaign: camp,
      callerState: simCallerState,
      appliedTags: [`geo:${simCallerState}`, derivedIvrTag, simCustomTag],
      steps: evaluationSteps,
      winner: winningEntry ? winningEntry.buyer : null
    });
  };

  // Toggle Buyer Active/Paused Status
  const toggleBuyerStatus = (buyerId) => {
    setBuyers((prev) =>
      prev.map((b) =>
        b.id === buyerId
          ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' }
          : b
      )
    );
  };

  // Create New Buyer
  const handleCreateBuyer = (e) => {
    e.preventDefault();
    if (!newBuyerForm.name.trim()) return;
    const created = {
      id: `BUY-0${buyers.length + 1}`,
      name: newBuyerForm.name,
      number: newBuyerForm.number,
      status: 'Active',
      activeCalls: 0,
      maxConcurrency: Number(newBuyerForm.maxConcurrency) || 10,
      dailyCalls: 0,
      dailyCap: Number(newBuyerForm.dailyCap) || 100,
      revenuePerCall: Number(newBuyerForm.revenuePerCall) || 55,
      targetDuration: Number(newBuyerForm.targetDuration) || 90,
      allowedStates: newBuyerForm.allowedStates
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean),
      requiredTags: newBuyerForm.requiredTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      hours: '09:00 - 20:00 EST',
      cvr: 70.0,
      epc: (Number(newBuyerForm.revenuePerCall) * 0.7).toFixed(2)
    };
    setBuyers((prev) => [created, ...prev]);
    setShowAddBuyerModal(false);
    setNewBuyerForm({
      name: '',
      number: '+1 (800) 555-0199',
      maxConcurrency: 10,
      dailyCap: 100,
      revenuePerCall: 55,
      targetDuration: 90,
      allowedStates: 'CA, TX, FL, NY',
      requiredTags: 'insured:true'
    });
  };

  // Create New Campaign
  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignForm.name.trim()) return;
    const newId = `CMP-10${campaigns.length + 1}`;
    const created = {
      id: newId,
      name: newCampaignForm.name,
      vertical: newCampaignForm.vertical,
      status: 'Active',
      payoutModel: `Duration >= ${newCampaignForm.targetDuration}s`,
      targetDuration: Number(newCampaignForm.targetDuration),
      defaultRevenue: Number(newCampaignForm.defaultRevenue),
      defaultPayout: Number(newCampaignForm.defaultPayout),
      dedupeDays: Number(newCampaignForm.dedupeDays),
      callsToday: 1,
      convertedToday: 1,
      revenueToday: Number(newCampaignForm.defaultRevenue),
      payoutToday: Number(newCampaignForm.defaultPayout),
      ivrEnabled: true,
      ivrPrompts: [
        {
          key: '1',
          label: 'Qualified Prospect (Yes)',
          tagAdded: 'qualified:true',
          action: 'Route to Tier 1 Waterfall'
        }
      ],
      routingRules: [
        {
          id: `R-${Date.now()}`,
          priority: 1,
          tier: 'Tier 1 - Primary',
          weight: 100,
          buyerId: buyers[0].id,
          buyerName: buyers[0].name,
          requiredTags: ['qualified:true'],
          revenue: Number(newCampaignForm.defaultRevenue),
          capStatus: '0/100 Daily'
        }
      ]
    };
    setCampaigns((prev) => [created, ...prev]);
    setSelectedCampaignId(newId);
    setShowNewCampaignModal(false);
  };

  // Filtered Call Logs
  const filteredCalls = useMemo(() => {
    return callLogs.filter((call) => {
      const matchesStatus =
        callStatusFilter === 'ALL' ||
        (callStatusFilter === 'LIVE' && call.isLive) ||
        call.status.toUpperCase() === callStatusFilter;
      const q = callSearchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        call.callerId.toLowerCase().includes(q) ||
        call.campaignName.toLowerCase().includes(q) ||
        call.buyerName.toLowerCase().includes(q) ||
        call.publisherName.toLowerCase().includes(q) ||
        call.tags.some((t) => t.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [callLogs, callStatusFilter, callSearchQuery]);

  const selectedCampaign = useMemo(
    () => campaigns.find((c) => c.id === selectedCampaignId) || campaigns[0],
    [campaigns, selectedCampaignId]
  );

  // Format seconds as MM:SS
  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  // Status Badge Helper
  const renderStatusBadge = (call) => {
    if (call.status === 'In Progress') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          In Progress ({call.durationSec}s / {call.targetDuration}s)
        </span>
      );
    }
    if (call.status === 'Converted') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Converted {call.isLive ? '(Live)' : ''}
        </span>
      );
    }
    if (call.status === 'Duplicate') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-400 border border-purple-500/30">
          <RefreshCw className="w-3.5 h-3.5" />
          Duplicate (30d)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
        <PhoneOff className="w-3.5 h-3.5" />
        {call.status}
      </span>
    );
  };

  const dniSnippetCode = `<!-- Rancell Call Dynamic Number Insertion (DNI) & Tagging Snippet -->
<script>
  (function(w,d,s,u,c){
    w.RancellCallDNI = w.RancellCallDNI || [];
    w.RancellCallDNI.push({
      campaign_key: "${selectedCampaign.id}_99f81a4b",
      number_pool_id: "POOL_US_TOLLFREE_01",
      replace_selector: ".dynamic-phone-cta",
      auto_capture_params: ["utm_source", "utm_campaign", "gclid", "fbclid", "state", "homeowner"],
      default_tags: { vertical: "${selectedCampaign.vertical}", lander_v: "v4_quiz" }
    });
    var js = d.createElement(s); js.async = 1;
    js.src = "https://cdn.rancellcall.com/dni/v2/retreaver-dni.min.js";
    d.head.appendChild(js);
  })(window, document, "script");
</script>`;

  const handleCopyDni = () => {
    navigator.clipboard?.writeText(dniSnippetCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row font-sans transition-colors duration-200 ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-64 bg-slate-900 border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="px-4 py-4 flex items-center justify-between border-b border-slate-800 bg-[#070b19]">
            <div className="flex items-center gap-3">
              {/* Custom SVG recreation of the Rancell Leads LLC metallic gold 'R' monogram */}
              <div className="w-11 h-11 rounded-xl bg-[#050814] border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10 shrink-0">
                <svg
                  viewBox="0 0 100 100"
                  className="w-8 h-8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="rancellGold1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFF2B2" />
                      <stop offset="30%" stopColor="#E6C15A" />
                      <stop offset="65%" stopColor="#B88728" />
                      <stop offset="100%" stopColor="#F5D77F" />
                    </linearGradient>
                    <linearGradient id="rancellGold2" x1="20%" y1="100%" x2="80%" y2="0%">
                      <stop offset="0%" stopColor="#9C6D16" />
                      <stop offset="50%" stopColor="#E5C158" />
                      <stop offset="100%" stopColor="#FFF5C0" />
                    </linearGradient>
                  </defs>
                  {/* Top serif & main stem + upper bowl of R */}
                  <path
                    d="M16 14 H52 C70 14 80 23 80 37 C80 49 71 57 57 59 C68 66 76 79 86 87 C89 89 92 90 96 90 V92 H81 C71 92 64 84 55 70 C49 61 45 56 38 54 V19 H29 V68 L19 81 V19 C19 16 17 15 14 15 V14 Z"
                    fill="url(#rancellGold1)"
                  />
                  {/* Inner cutout of R bowl */}
                  <path
                    d="M38 20 V50 H50 C61 50 67 45 67 35 C67 25 61 20 50 20 H38 Z"
                    fill="#050814"
                  />
                  {/* Swooping double-ribbon slash & tail */}
                  <path
                    d="M11 92 C20 88 28 76 38 58 L38 72 C32 82 25 89 16 92 H11 Z"
                    fill="url(#rancellGold2)"
                  />
                  <path
                    d="M23 92 C29 88 34 81 38 74 V87 C38 89 40 90 45 90 V92 H23 Z"
                    fill="url(#rancellGold1)"
                  />
                  <path
                    d="M40 55 C48 63 56 77 65 86 C69 90 73 91 77 92 H63 C55 88 47 74 39 59 Z"
                    fill="url(#rancellGold2)"
                  />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight text-white">
                    Rancell Call
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    RTB v4.2
                  </span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-400/90 mt-0.5">
                  Rancell Leads LLC
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white lg:hidden"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Live System Pulse Bar */}
          <div className="mx-4 my-3 p-3 rounded-xl bg-slate-800/70 border border-slate-700/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SIP Router Online
              </span>
              <span className="text-slate-400 font-mono">14ms latency</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span>Active Live Calls:</span>
              <span className="font-bold text-white px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                {kpis.activeLiveCount} Live
              </span>
            </div>
          </div>

          {/* Primary Nav Links */}
          <nav className="px-3 py-2 flex lg:flex-col gap-1 overflow-x-auto">
            {[
              { id: 'dashboard', label: 'Live Monitor & KPIs', icon: Activity, badge: `${kpis.activeLiveCount}` },
              { id: 'campaigns', label: 'Campaigns & Routing', icon: GitMerge, badge: campaigns.length },
              { id: 'buyers', label: 'Buyers / Endpoints', icon: Headphones, badge: buyers.length },
              { id: 'publishers', label: 'Publishers & DNI Pool', icon: Globe, badge: '87 DIDs' },
              { id: 'logs', label: 'Call Logs & Webhooks', icon: Terminal, badge: callLogs.length }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Actions in Sidebar */}
        <div className="hidden lg:flex flex-col gap-2.5 p-4 border-t border-slate-800">
          <button
            onClick={handleSimulateIncomingCall}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <PhoneIncoming className="w-4 h-4 animate-bounce" />
            Simulate Incoming Call
          </button>
          <button
            onClick={() => {
              handleRunRouteSimulation();
              setShowRouterSimulatorModal(true);
            }}
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Test Call Router Engine
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR */}
        <header
          className={`px-6 py-4 border-b flex flex-wrap items-center justify-between gap-4 ${
            darkMode
              ? 'bg-slate-900/60 border-slate-800'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2.5">
              {activeTab === 'dashboard' && 'Rancell Call — Executive Live Call & Telemetry Center'}
              {activeTab === 'campaigns' && 'Rancell Call — Campaigns & Smart Waterfall Routing'}
              {activeTab === 'buyers' && 'Rancell Call — Call Buyers, Concurrency & Endpoint Caps'}
              {activeTab === 'publishers' && 'Rancell Call — Affiliate Publishers, DIDs & DNI Pool'}
              {activeTab === 'logs' && 'Rancell Call — Real-Time Call Log Inspector & S2S Postbacks'}
            </h1>
            <p className={`text-xs mt-0.5 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Rancell Leads LLC • Real-time tag-based call routing, IVR qualification, and 90-second conversion billing
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSimulateIncomingCall}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <PhoneIncoming className="w-4 h-4" />
              <span>Simulate Live Call</span>
            </button>

            <button
              onClick={() => {
                handleRunRouteSimulation();
                setShowRouterSimulatorModal(true);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Test Router</span>
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`hidden lg:flex p-2 rounded-xl border transition-all cursor-pointer ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-950'
              }`}
              title="Toggle Dark/Light Mode"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* WORKSPACE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ==========================================
              TAB 1: EXECUTIVE DASHBOARD & LIVE MONITOR
             ========================================== */}
          {activeTab === 'dashboard' && (
            <>
              {/* 6 REAL-TIME KPI SUMMARY CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode
                      ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-500/5'
                      : 'bg-white border-emerald-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-emerald-400 mb-2">
                    <span>ACTIVE LIVE CALLS</span>
                    <Radio className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight flex items-baseline gap-2">
                    <span>{kpis.activeLiveCount}</span>
                    <span className="text-xs font-semibold text-emerald-400">
                      In-Flight
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    48 / 81 Buyer ports open
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>TOTAL CALLS TODAY</span>
                    <PhoneCall className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight">
                    {kpis.totalCallsToday.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> +14.2% vs yesterday
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>CONVERTED (BILLABLE)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight">
                    {kpis.convertedToday.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Passed 90s / 120s timer
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>GROSS REVENUE</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight text-emerald-400">
                    ${kpis.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Payout: ${kpis.totalPayout.toLocaleString()}
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>NET MARGIN PROFIT</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight text-indigo-400">
                    ${kpis.netMargin.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    27.4% net arbitrage spread
                  </p>
                </div>

                <div
                  className={`p-4 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-2">
                    <span>CONVERSION RATE</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold tracking-tight">
                    {kpis.cvr}%
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Avg Connected: 03m 18s
                  </p>
                </div>
              </div>

              {/* CHARTS & BUYER CAPACITY ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Hourly Call Volume & Conversions Chart */}
                <div
                  className={`lg:col-span-2 p-5 rounded-2xl border ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h2 className="text-base font-bold">
                        Hourly Call Volume vs. Billable Conversions
                      </h2>
                      <p className="text-xs text-slate-400">
                        Comparing total inbound connects against &ge; 90s billable threshold
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                        Total Inbound Calls
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                        Converted Calls (90s+)
                      </span>
                    </div>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={HOURLY_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={darkMode ? '#1e293b' : '#e2e8f0'}
                        />
                        <XAxis
                          dataKey="hour"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                        />
                        <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: darkMode ? '#0f172a' : '#ffffff',
                            borderColor: darkMode ? '#334155' : '#cbd5e1',
                            borderRadius: '12px',
                            fontSize: '12px'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="totalCalls"
                          name="Total Calls"
                          stroke="#6366f1"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorTotal)"
                        />
                        <Area
                          type="monotone"
                          dataKey="convertedCalls"
                          name="Billable Converted"
                          stroke="#10b981"
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorConv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Buyer Concurrency & Cap Status */}
                <div
                  className={`p-5 rounded-2xl border flex flex-col justify-between ${
                    darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-base font-bold">Live Buyer Concurrency</h2>
                        <p className="text-xs text-slate-400">
                          Real-time call center port utilization
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('buyers')}
                        className="text-xs text-indigo-400 hover:underline font-medium"
                      >
                        Manage All
                      </button>
                    </div>

                    <div className="space-y-3.5">
                      {buyers.slice(0, 5).map((buyer) => {
                        const pct = Math.min(
                          100,
                          Math.round((buyer.activeCalls / buyer.maxConcurrency) * 100)
                        );
                        return (
                          <div key={buyer.id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium truncate max-w-[180px]">
                                {buyer.name}
                              </span>
                              <span className="font-mono text-slate-400">
                                <strong className="text-emerald-400">{buyer.activeCalls}</strong>/
                                {buyer.maxConcurrency} ports ({buyer.dailyCalls}/{buyer.dailyCap} cap)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  pct > 80
                                    ? 'bg-amber-500'
                                    : 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                                }`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>Overflow Waterfall Queue:</span>
                    <span className="text-emerald-400 font-semibold">0 Calls Holding</span>
                  </div>
                </div>
              </div>

              {/* LIVE CALL MONITOR TABLE */}
              <div
                className={`rounded-2xl border overflow-hidden ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="p-5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                    <div>
                      <h2 className="text-base font-bold">
                        Live Call Stream & Real-Time Attribution Feed
                      </h2>
                      <p className="text-xs text-slate-400">
                        Click any call row to inspect IVR keypresses, DNI tags, audio recording, and S2S postbacks
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search Caller ID, tag (geo:CA), buyer..."
                        value={callSearchQuery}
                        onChange={(e) => setCallSearchQuery(e.target.value)}
                        className={`pl-9 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-100'
                            : 'bg-slate-100 border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    {['ALL', 'LIVE', 'CONVERTED', 'SHORT CALL'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setCallStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          callStatusFilter === status
                            ? 'bg-indigo-600 text-white'
                            : darkMode
                            ? 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr
                        className={`text-[11px] font-semibold uppercase tracking-wider border-b ${
                          darkMode
                            ? 'bg-slate-950/50 text-slate-400 border-slate-800'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >
                        <th className="py-3.5 px-4">Caller ID & Geo</th>
                        <th className="py-3.5 px-4">Campaign & Publisher</th>
                        <th className="py-3.5 px-4">Assigned Buyer Endpoint</th>
                        <th className="py-3.5 px-4">Dynamic Routing Tags</th>
                        <th className="py-3.5 px-4">Duration Timer</th>
                        <th className="py-3.5 px-4">Rev / Payout</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Inspect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-xs">
                      {filteredCalls.map((call) => (
                        <tr
                          key={call.id}
                          onClick={() => setSelectedCall(call)}
                          className={`cursor-pointer transition-colors ${
                            call.isLive
                              ? darkMode
                                ? 'bg-emerald-950/15 hover:bg-emerald-950/30'
                                : 'bg-emerald-50/70 hover:bg-emerald-100/70'
                              : darkMode
                              ? 'hover:bg-slate-800/50'
                              : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-sm flex items-center gap-2">
                              {call.isLive && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              )}
                              {call.callerId}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <span>{call.callerCity}</span>
                              <span>•</span>
                              <span>{call.timestamp}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-indigo-400 truncate max-w-[220px]">
                              {call.campaignName}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Source: <span className="text-slate-300">{call.publisherName}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium">{call.buyerName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Target &ge; {call.targetDuration}s
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-[240px]">
                              {call.tags.map((tag, idx) => (
                                <span
                                  key={idx}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                                    darkMode
                                      ? 'bg-slate-800 text-slate-300 border border-slate-700'
                                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                                  }`}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-sm">
                              {formatDuration(call.durationSec)}
                            </div>
                            <div className="w-20 h-1.5 rounded-full bg-slate-800 mt-1 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  call.durationSec >= call.targetDuration
                                    ? 'bg-emerald-400'
                                    : 'bg-amber-400'
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (call.durationSec / call.targetDuration) * 100
                                  )}%`
                                }}
                              />
                            </div>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {call.revenue > 0 ? (
                              <div>
                                <div className="font-bold text-emerald-400 text-sm">
                                  +${call.revenue.toFixed(2)}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  Pay: ${call.payout.toFixed(2)}
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-mono">$0.00</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            {renderStatusBadge(call)}
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCall(call);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Trace
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ==========================================
              TAB 2: CAMPAIGNS & SMART CALL ROUTING TREE
             ========================================== */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Campaign Directory */}
              <div className="lg:col-span-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold">Active Inbound Campaigns</h2>
                  <button
                    onClick={() => setShowNewCampaignModal(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Campaign
                  </button>
                </div>

                <div className="space-y-3">
                  {campaigns.map((camp) => {
                    const isSelected = camp.id === selectedCampaign.id;
                    return (
                      <div
                        key={camp.id}
                        onClick={() => setSelectedCampaignId(camp.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                            : darkMode
                            ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-300">
                              {camp.id} • {camp.vertical}
                            </span>
                            <h3 className="font-bold text-sm mt-1.5">{camp.name}</h3>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {camp.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
                          <div>
                            <div className="text-slate-400 text-[10px]">Trigger</div>
                            <div className="font-semibold">{camp.targetDuration}s Connect</div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px]">Rev / Payout</div>
                            <div className="font-semibold text-emerald-400">
                              ${camp.defaultRevenue} / ${camp.defaultPayout}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-[10px]">Today Calls</div>
                            <div className="font-semibold">
                              {camp.convertedToday}/{camp.callsToday}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Visual Call Routing & IVR Flow Builder */}
              <div
                className={`lg:col-span-8 p-6 rounded-2xl border space-y-6 ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400">
                        {selectedCampaign.id}
                      </span>
                      <span className="text-xs text-slate-500">•</span>
                      <span className="text-xs text-emerald-400 font-medium">
                        Dedupe Window: {selectedCampaign.dedupeDays} Days
                      </span>
                    </div>
                    <h2 className="text-lg font-bold mt-0.5">{selectedCampaign.name}</h2>
                  </div>

                  <button
                    onClick={() => {
                      setSimCampaignId(selectedCampaign.id);
                      handleRunRouteSimulation();
                      setShowRouterSimulatorModal(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    Simulate Routing for Campaign
                  </button>
                </div>

                {/* VISUAL CALL FLOW STAGES */}
                <div className="space-y-6">
                  {/* STAGE 1: DNI & INBOUND SOURCE TAGS */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Stage 1: Inbound Tracking Number Pool & DNI Tag Capture
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Real-Time Caller Enrichment
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      Automatically attaches caller state from NPA-NXX lookup and merges landing page URL parameters via Retreaver DNI JavaScript pool.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'caller_state: Auto-Geo',
                        'utm_source: Captured',
                        'click_id: Captured',
                        'homeowner: URL/Quiz Param',
                        'credit_tier: URL/Quiz Param'
                      ].map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* STAGE 2: INTERACTIVE VOICE RESPONSE (IVR) QUALIFICATION */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        Stage 2: IVR Keypress Qualification & Dynamic Tagging
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {selectedCampaign.ivrEnabled ? 'IVR Active' : 'Direct Pass-Through'}
                      </span>
                    </div>

                    {selectedCampaign.ivrPrompts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {selectedCampaign.ivrPrompts.map((prompt) => (
                          <div
                            key={prompt.key}
                            className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs">
                                  Key [{prompt.key}]
                                </span>
                                <span className="text-[11px] font-mono text-emerald-400">
                                  +{prompt.tagAdded}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-slate-200">
                                "{prompt.label}"
                              </p>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1">
                              <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                              {prompt.action}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">
                        No IVR prompts configured — emergency calls bridge immediately to Tier 1 dispatch.
                      </p>
                    )}
                  </div>

                  {/* STAGE 3: BUYER WATERFALL & PRIORITY ROUTING QUEUE */}
                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        Stage 3: Tag-Matched Buyer Waterfall & Priority Queue
                      </span>
                      <span className="text-xs text-slate-400">
                        Evaluated by Priority Tier, Tag Match & Open Concurrency
                      </span>
                    </div>

                    <div className="space-y-3">
                      {selectedCampaign.routingRules.map((rule) => (
                        <div
                          key={rule.id}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold text-xs flex items-center justify-center">
                              P{rule.priority}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">
                                  {rule.buyerName}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  Weight: {rule.weight}%
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <span className="text-[11px] text-slate-400">Required Tags:</span>
                                {rule.requiredTags.map((t, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px] font-mono"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs">
                            <div className="text-right">
                              <div className="text-slate-400 text-[10px]">Buyer Payout</div>
                              <div className="font-bold text-emerald-400">
                                ${rule.revenue.toFixed(2)} @ {selectedCampaign.targetDuration}s
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-slate-400 text-[10px]">Daily Cap</div>
                              <div className="font-mono text-slate-200">{rule.capStatus}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 3: BUYERS (CALL CENTERS / ENDPOINTS)
             ========================================== */}
          {activeTab === 'buyers' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold">
                    Call Buyer Directory & Endpoint Concurrency Controls
                  </h2>
                  <p className="text-xs text-slate-400">
                    Manage destination numbers, real-time concurrency caps, state geo-filters, and active status
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBuyerModal(true)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Buyer Endpoint
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {buyers.map((buyer) => {
                  const concurrencyPct = Math.min(
                    100,
                    Math.round((buyer.activeCalls / buyer.maxConcurrency) * 100)
                  );
                  const dailyCapPct = Math.min(
                    100,
                    Math.round((buyer.dailyCalls / buyer.dailyCap) * 100)
                  );

                  return (
                    <div
                      key={buyer.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                        darkMode
                          ? 'bg-slate-900/90 border-slate-800'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div>
                            <span className="text-[10px] font-mono text-indigo-400">
                              {buyer.id} • {buyer.hours}
                            </span>
                            <h3 className="font-bold text-base mt-0.5">{buyer.name}</h3>
                            <p className="text-xs font-mono text-slate-400 mt-0.5">
                              DID: {buyer.number}
                            </p>
                          </div>

                          <button
                            onClick={() => toggleBuyerStatus(buyer.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                              buyer.status === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                buyer.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-500'
                              }`}
                            />
                            {buyer.status}
                          </button>
                        </div>

                        {/* Concurrency & Cap Progress Bars */}
                        <div className="space-y-3 my-4 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80">
                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Live Concurrency Cap</span>
                              <span className="font-mono font-semibold">
                                {buyer.activeCalls} / {buyer.maxConcurrency} Active
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-emerald-400 rounded-full"
                                style={{ width: `${concurrencyPct}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-slate-400">Daily Billable Cap</span>
                              <span className="font-mono font-semibold">
                                {buyer.dailyCalls} / {buyer.dailyCap} Calls ({dailyCapPct}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${dailyCapPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Tag Filters */}
                        <div className="space-y-2 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-slate-400">Accepted States:</span>
                            {buyer.allowedStates.map((st) => (
                              <span
                                key={st}
                                className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-mono text-[10px]"
                              >
                                {st}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-slate-400">Required Tags:</span>
                            {buyer.requiredTags.map((tg) => (
                              <span
                                key={tg}
                                className="px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-mono text-[10px]"
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer Metrics */}
                      <div className="grid grid-cols-3 gap-2 mt-5 pt-3 border-t border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Contract Rate</span>
                          <span className="font-bold text-emerald-400">
                            ${buyer.revenuePerCall.toFixed(2)} @ {buyer.targetDuration}s
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Conv. Rate</span>
                          <span className="font-bold">{buyer.cvr}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Avg EPC</span>
                          <span className="font-bold text-indigo-400">${buyer.epc}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 4: PUBLISHERS & DNI NUMBER POOLS
             ========================================== */}
          {activeTab === 'publishers' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Columns: Publishers Table */}
              <div
                className={`lg:col-span-7 rounded-2xl border overflow-hidden ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="p-5 border-b border-slate-800">
                  <h2 className="text-base font-bold">
                    Affiliate Publishers & Traffic Sources
                  </h2>
                  <p className="text-xs text-slate-400">
                    Assigned Toll-Free DIDs, payout rules, and S2S conversion webhook endpoints
                  </p>
                </div>

                <div className="divide-y divide-slate-800">
                  {publishers.map((pub) => (
                    <div key={pub.id} className="p-5 space-y-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-indigo-400">
                              {pub.id}
                            </span>
                            <h3 className="font-bold text-sm">{pub.name}</h3>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {pub.sourceType}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            Primary Pool DID:{' '}
                            <span className="font-mono text-slate-200">{pub.primaryDid}</span> (
                            {pub.didsAssigned} numbers in pool)
                          </p>
                        </div>

                        <div className="text-right">
                          <div className="text-sm font-bold text-emerald-400">
                            ${pub.payoutEarned.toLocaleString()} Earned
                          </div>
                          <div className="text-[11px] text-slate-400">{pub.payoutModel}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Calls Sent Today</span>
                          <span className="font-bold">{pub.callsSent}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Billable Calls</span>
                          <span className="font-bold text-emerald-400">{pub.billableCalls}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Billable CVR</span>
                          <span className="font-bold">{pub.cvr}%</span>
                        </div>
                      </div>

                      <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 truncate">
                        <span className="text-indigo-400 font-semibold">S2S Postback: </span>
                        {pub.postbackUrl}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 5 Columns: Dynamic Number Insertion (DNI) Generator */}
              <div
                className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Rancell Call DNI JS SDK
                      </span>
                      <h2 className="text-base font-bold mt-1">
                        Dynamic Number Insertion & URL Tagging
                      </h2>
                    </div>
                    <Code className="w-5 h-5 text-amber-400" />
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    Drop this lightweight script on any affiliate landing page or advertorial. It automatically swaps phone numbers from your concurrency pool and attaches URL parameters (<code className="text-emerald-400">?state=CA&homeowner=true&fbclid=...</code>) directly to the live call before it rings!
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Select Campaign Pool for Snippet:
                    </label>
                    <select
                      value={selectedCampaignId}
                      onChange={(e) => setSelectedCampaignId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-slate-800 border border-slate-700 text-slate-100"
                    >
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id} — {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                      {dniSnippetCode}
                    </pre>
                    <button
                      onClick={handleCopyDni}
                      className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Snippet
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-1.5">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Real-Time Session Ring Pool Health
                  </div>
                  <p className="text-slate-400">
                    87 Toll-Free DIDs active across 4 pools. Average number lease time: 180 seconds per unique visitor session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB 5: CALL LOGS & WEBHOOK DEBUGGER
             ========================================== */}
          {activeTab === 'logs' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div
                className={`lg:col-span-12 rounded-2xl border overflow-hidden ${
                  darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold">
                      Complete Call Audit Log & S2S Postback Ledger
                    </h2>
                    <p className="text-xs text-slate-400">
                      Click any call record to open the full Timeline Inspector, Audio Player, and Webhook Payload Debugger
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedCall(callLogs[0])}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <Terminal className="w-4 h-4" />
                    Inspect Latest Call ({callLogs[0]?.id})
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-semibold uppercase tracking-wider bg-slate-950/50 text-slate-400 border-b border-slate-800">
                        <th className="py-3.5 px-4">Call UUID</th>
                        <th className="py-3.5 px-4">Caller & State</th>
                        <th className="py-3.5 px-4">Campaign</th>
                        <th className="py-3.5 px-4">Buyer Endpoint</th>
                        <th className="py-3.5 px-4">Duration</th>
                        <th className="py-3.5 px-4">Financials</th>
                        <th className="py-3.5 px-4">Disposition</th>
                        <th className="py-3.5 px-4 text-right">Debugger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-xs">
                      {callLogs.map((call) => (
                        <tr
                          key={call.id}
                          onClick={() => setSelectedCall(call)}
                          className="hover:bg-slate-800/50 cursor-pointer"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                            {call.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-mono font-semibold">{call.callerId}</div>
                            <div className="text-[11px] text-slate-400">{call.callerCity}</div>
                          </td>
                          <td className="py-3.5 px-4">{call.campaignName}</td>
                          <td className="py-3.5 px-4">{call.buyerName}</td>
                          <td className="py-3.5 px-4 font-mono font-bold">
                            {formatDuration(call.durationSec)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="text-emerald-400 font-bold">
                              ${call.revenue.toFixed(2)}
                            </span>{' '}
                            / <span className="text-slate-400">${call.payout.toFixed(2)}</span>
                          </td>
                          <td className="py-3.5 px-4">{renderStatusBadge(call)}</td>
                          <td className="py-3.5 px-4 text-right">
                            <button className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 hover:bg-indigo-600">
                              Open Trace
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* =================================================================
          SLIDE-OVER DRAWER: CALL LOG TIMELINE, AUDIO & WEBHOOK INSPECTOR
         ================================================================= */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 text-slate-100 shadow-2xl">
            {/* Drawer Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-indigo-400">
                    {selectedCall.id}
                  </span>
                  {renderStatusBadge(selectedCall)}
                </div>
                <h3 className="text-lg font-bold mt-1">
                  Caller {selectedCall.callerId} ({selectedCall.callerCity})
                </h3>
                <p className="text-xs text-slate-400">
                  Campaign: {selectedCall.campaignName} • Publisher: {selectedCall.publisherName}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCall(null);
                  setIsAudioPlaying(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block">Connected Duration</span>
                <span className="text-base font-mono font-bold text-white">
                  {formatDuration(selectedCall.durationSec)}{' '}
                  <span className="text-xs font-normal text-slate-400">
                    (Req: {selectedCall.targetDuration}s)
                  </span>
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Buyer Revenue</span>
                <span className="text-base font-bold text-emerald-400">
                  ${selectedCall.revenue.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Affiliate Payout</span>
                <span className="text-base font-bold text-indigo-400">
                  ${selectedCall.payout.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Simulated Dual-Channel Call Recording & AI Transcript */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  Dual-Channel Call Recording & Live Whisper
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  256kbps Stereo WAV
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                  className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shrink-0 cursor-pointer"
                >
                  {isAudioPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                {/* Simulated SVG Waveform Bars */}
                <div className="flex-1 flex items-center gap-1 h-10 px-3 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  {[
                    35, 65, 45, 80, 55, 90, 40, 70, 85, 50, 30, 75, 95, 60, 45, 80, 65, 40, 88,
                    52, 74, 62, 48, 90, 55, 70, 45, 60, 80, 50
                  ].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        isAudioPlaying
                          ? i % 2 === 0
                            ? 'bg-emerald-400 animate-pulse'
                            : 'bg-indigo-400'
                          : 'bg-slate-700'
                      }`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 italic">
                {selectedCall.transcriptSnippet}
              </div>
            </div>

            {/* Attached Call Attributes / Tags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-400" />
                Attached DNI & IVR Call Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCall.tags.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Step-by-Step Call Routing & Postback Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
                Sub-Second Routing & Webhook Event Trace
              </h4>

              <div className="space-y-2.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {selectedCall.timeline.map((step, index) => (
                  <div key={index} className="relative pl-9">
                    <span
                      className={`w-3 h-3 rounded-full absolute left-2 top-1.5 border-2 border-slate-900 ${
                        step.type === 'convert'
                          ? 'bg-emerald-400'
                          : step.type === 'webhook'
                          ? 'bg-indigo-400'
                          : step.type === 'error'
                          ? 'bg-rose-400'
                          : 'bg-amber-400'
                      }`}
                    />
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-100">{step.event}</span>
                        <span className="font-mono text-[11px] text-slate-400">
                          +{step.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 font-mono">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: INTERACTIVE SMART CALL ROUTER SIMULATOR ("TEST ROUTER")
         ================================================================= */}
      {showRouterSimulatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    Smart Call Routing Simulator & Waterfall Debugger
                  </h3>
                  <p className="text-xs text-slate-400">
                    Test which Buyer Endpoint wins a call based on Caller Geo, IVR Keypress, and Live Caps
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRouterSimulatorModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulator Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Caller US State (Geo)</label>
                <select
                  value={simCallerState}
                  onChange={(e) => setSimCallerState(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="CA">CA (California)</option>
                  <option value="TX">TX (Texas)</option>
                  <option value="FL">FL (Florida)</option>
                  <option value="NY">NY (New York)</option>
                  <option value="AZ">AZ (Arizona)</option>
                  <option value="GA">GA (Georgia)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Simulated IVR Keypress</label>
                <select
                  value={simIvrKey}
                  onChange={(e) => setSimIvrKey(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
                >
                  <option value="1">Press 1 (insured:true)</option>
                  <option value="2">Press 2 (sr22:true)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Additional DNI Tag</label>
                <input
                  type="text"
                  value={simCustomTag}
                  onChange={(e) => setSimCustomTag(e.target.value)}
                  placeholder="e.g. homeowner:true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleRunRouteSimulation}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Re-Evaluate Buyer Waterfall
            </button>

            {/* Simulation Output */}
            {simResult && (
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-400">
                      Winning Route Selected (0.8ms)
                    </span>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {simResult.winner
                        ? `${simResult.winner.name} (${simResult.winner.number})`
                        : 'No Matching Buyer Available (Overflow Queue)'}
                    </div>
                  </div>
                  {simResult.winner && (
                    <span className="text-sm font-bold text-emerald-400">
                      ${simResult.winner.revenuePerCall.toFixed(2)} Payout
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400">
                    Endpoint Evaluation Breakdown:
                  </div>
                  {simResult.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        step.passed
                          ? 'bg-slate-950 border-emerald-500/40'
                          : 'bg-slate-950/50 border-slate-800 opacity-75'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-200">{step.buyer.name}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                          {step.reason}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                          step.passed
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {step.passed ? 'ELIGIBLE' : 'SKIPPED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================
          MODAL: ADD NEW BUYER ENDPOINT
         ================================================================= */}
      {showAddBuyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateBuyer}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">Add New Call Buyer Endpoint</h3>
              <button
                type="button"
                onClick={() => setShowAddBuyerModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Buyer / Call Center Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geico Regional Auto Desk"
                  value={newBuyerForm.name}
                  onChange={(e) => setNewBuyerForm({ ...newBuyerForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Destination DID Number</label>
                  <input
                    type="text"
                    value={newBuyerForm.number}
                    onChange={(e) => setNewBuyerForm({ ...newBuyerForm, number: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Payout per Converted Call ($)</label>
                  <input
                    type="number"
                    value={newBuyerForm.revenuePerCall}
                    onChange={(e) =>
                      setNewBuyerForm({ ...newBuyerForm, revenuePerCall: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Max Live Concurrency</label>
                  <input
                    type="number"
                    value={newBuyerForm.maxConcurrency}
                    onChange={(e) =>
                      setNewBuyerForm({ ...newBuyerForm, maxConcurrency: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Daily Call Cap</label>
                  <input
                    type="number"
                    value={newBuyerForm.dailyCap}
                    onChange={(e) =>
                      setNewBuyerForm({ ...newBuyerForm, dailyCap: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Allowed US States (Comma-separated or ALL_US)
                </label>
                <input
                  type="text"
                  value={newBuyerForm.allowedStates}
                  onChange={(e) =>
                    setNewBuyerForm({ ...newBuyerForm, allowedStates: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Required Routing Tags</label>
                <input
                  type="text"
                  value={newBuyerForm.requiredTags}
                  onChange={(e) =>
                    setNewBuyerForm({ ...newBuyerForm, requiredTags: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddBuyerModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
              >
                Save Buyer Endpoint
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================
          MODAL: CREATE NEW PAY-PER-CALL CAMPAIGN
         ================================================================= */}
      {showNewCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCampaign}
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold">Launch New Pay-Per-Call Campaign</h3>
              <button
                type="button"
                onClick={() => setShowNewCampaignModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. US Debt Consolidation - Inbound"
                  value={newCampaignForm.name}
                  onChange={(e) =>
                    setNewCampaignForm({ ...newCampaignForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vertical</label>
                  <input
                    type="text"
                    value={newCampaignForm.vertical}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, vertical: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Billable Duration Trigger (s)</label>
                  <input
                    type="number"
                    value={newCampaignForm.targetDuration}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, targetDuration: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Buyer Revenue ($)</label>
                  <input
                    type="number"
                    value={newCampaignForm.defaultRevenue}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, defaultRevenue: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Affiliate Payout ($)</label>
                  <input
                    type="number"
                    value={newCampaignForm.defaultPayout}
                    onChange={(e) =>
                      setNewCampaignForm({ ...newCampaignForm, defaultPayout: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewCampaignModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
              >
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
