// Test script to validate canvas navigation behavior
const { chromium } = require('@playwright/test');

async function testCanvasNavigation() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Navigating to localhost:1420...');
  await page.goto('http://localhost:1420');
  
  // Wait for the app to load
  await page.waitForTimeout(3000);
  
  // Check if we're on the demo page or authenticated page
  const isDemoPage = await page.locator('.demo-canvas').count() > 0;
  
  if (isDemoPage) {
    console.log('On demo page - need to authenticate first');
    // Would need to handle authentication here
  } else {
    console.log('App loaded successfully');
    
    // Wait for canvas to be ready
    await page.waitForSelector('.react-flow__renderer', { timeout: 10000 });
    
    // Check initial state
    console.log('Checking initial canvas state...');
    const problemNode = await page.locator('[data-id="problem-input"]').boundingBox();
    console.log('Problem node initial position:', problemNode);
    
    // Enter a problem
    console.log('Entering problem text...');
    await page.fill('textarea.problem-textarea', 'my computer has too many apps and it causes things to run super slow');
    
    // Get problem node dimensions before validation
    const problemNodeBefore = await page.locator('[data-id="problem-input"]').boundingBox();
    console.log('Problem node size before validation:', {
      width: problemNodeBefore?.width,
      height: problemNodeBefore?.height
    });
    
    // Click Analyze Problem button
    console.log('Clicking Analyze Problem button...');
    await page.click('button:has-text("Analyze Problem")');
    
    // Wait for validation to complete
    await page.waitForTimeout(3000);
    
    // Check if we moved to Step 2
    const currentStep = await page.locator('.progress-step.active').textContent();
    console.log('Current step after validation:', currentStep);
    
    // Check problem node dimensions after validation
    const problemNodeAfter = await page.locator('[data-id="problem-input"]').boundingBox();
    console.log('Problem node size after validation:', {
      width: problemNodeAfter?.width,
      height: problemNodeAfter?.height
    });
    
    // Check if size changed
    if (problemNodeBefore && problemNodeAfter) {
      const widthChange = Math.abs((problemNodeAfter.width || 0) - (problemNodeBefore.width || 0));
      const heightChange = Math.abs((problemNodeAfter.height || 0) - (problemNodeBefore.height || 0));
      console.log('Size changes:', { widthChange, heightChange });
      
      if (widthChange > 5 || heightChange > 5) {
        console.error('WARNING: Problem node size changed significantly!');
      }
    }
    
    // Check personas label alignment
    const personasLabel = await page.locator('[data-id="personas-label"]').boundingBox();
    const firstPersona = await page.locator('[data-id="persona-1"]').boundingBox();
    
    if (personasLabel && firstPersona) {
      const xAlignment = Math.abs((personasLabel.x || 0) - (firstPersona.x || 0));
      console.log('Personas label X alignment offset:', xAlignment);
      
      if (xAlignment > 10) {
        console.error('WARNING: Personas label is misaligned with persona nodes!');
      }
    }
    
    // Check viewport zoom
    const viewport = await page.evaluate(() => {
      const reactFlow = window.reactFlowInstance;
      if (reactFlow) {
        return reactFlow.getViewport();
      }
      return null;
    });
    
    console.log('Current viewport:', viewport);
  }
  
  // Keep browser open for manual inspection
  console.log('Test complete. Browser will remain open for inspection.');
  
  // Uncomment to close:
  // await browser.close();
}

testCanvasNavigation().catch(console.error); 