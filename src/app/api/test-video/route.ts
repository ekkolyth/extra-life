import { NextResponse } from 'next/server';

// Simple in-memory store for test video triggers with timestamp
let lastTriggerTime = 0;

export async function POST() {
  lastTriggerTime = Date.now();
  console.log('🎬 Test video triggered via API at', new Date(lastTriggerTime).toISOString());
  return NextResponse.json({ success: true, timestamp: lastTriggerTime });
}

export async function GET() {
  const now = Date.now();
  const timeSinceTrigger = now - lastTriggerTime;
  
  // Trigger is valid for 2 seconds
  const triggered = timeSinceTrigger < 2000 && lastTriggerTime > 0;
  
  if (triggered) {
    console.log('🎬 Test video trigger detected, time since:', timeSinceTrigger + 'ms');
  }
  
  return NextResponse.json({ triggered, timeSinceTrigger });
}