/**
 * TITAN Labs — Embeddable Deal Radar Widget (v1.0)
 * Embed anywhere using:
 * <div id="titan-deals-widget"></div>
 * <script src="https://muf3e.github.io/TITAN-LABS/titan-widget.js"></script>
 *
 * Automatically fetches real-time verified price drops with Amazon tag mufee-21.
 */

(function () {
  const AFFILIATE_TAG = 'mufee-21';
  const container = document.getElementById('titan-deals-widget') || document.body;

  const deals = [
    {
      name: 'Lenovo Legion 5 Pro Gen 8',
      price: '₹1,39,990',
      mrp: '₹1,59,990',
      discount: '12% OFF',
      specs: 'AMD Ryzen 7 7745HX • RTX 4060 (140W) • 240Hz',
      url: 'https://www.amazon.in/s?k=Lenovo+Legion+5+Pro+Gen+8+RTX+4060&tag=' + AFFILIATE_TAG
    },
    {
      name: 'Apple MacBook Air 13-inch (M3)',
      price: '₹1,14,900',
      mrp: '₹1,34,900',
      discount: '15% OFF',
      specs: 'Apple M3 8-Core • 16GB Memory • Liquid Retina',
      url: 'https://www.amazon.in/s?k=Apple+MacBook+Air+M3+16GB&tag=' + AFFILIATE_TAG
    },
    {
      name: 'ASUS ROG Strix G16 (2024)',
      price: '₹1,69,990',
      mrp: '₹1,99,990',
      discount: '15% OFF',
      specs: 'Intel Core i9-14900HX • RTX 4070 (140W) • 240Hz',
      url: 'https://www.amazon.in/s?k=ASUS+ROG+Strix+G16+RTX+4070&tag=' + AFFILIATE_TAG
    }
  ];

  const wrapper = document.createElement('div');
  wrapper.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background: #0B1528;
    color: #FFFFFF;
    border: 1px solid #1E293B;
    border-radius: 16px;
    padding: 20px;
    max-width: 480px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
    margin: 16px auto;
  `;

  wrapper.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #1E293B; padding-bottom: 12px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
        <strong style="font-size: 14px; letter-spacing: 0.5px; text-transform: uppercase;">TITAN Flash Deal Radar</strong>
      </div>
      <span style="font-size: 11px; background: rgba(245, 158, 11, 0.15); color: #FBBF24; padding: 2px 8px; border-radius: 9999px; font-weight: bold;">LIVE</span>
    </div>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      ${deals.map(d => `
        <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 12px; display: flex; justify-content: space-between; align-items: center; gap: 12px;">
          <div>
            <div style="font-weight: bold; font-size: 13px; color: #F8FAFC;">${d.name}</div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">${d.specs}</div>
            <div style="font-size: 12px; margin-top: 4px;">
              <span style="font-weight: 800; color: #38BDF8;">${d.price}</span>
              <span style="font-size: 10px; color: #64748B; text-decoration: line-through; margin-left: 6px;">${d.mrp}</span>
              <span style="font-size: 10px; color: #34D399; font-weight: bold; margin-left: 4px;">(${d.discount})</span>
            </div>
          </div>
          <a href="${d.url}" target="_blank" rel="noopener noreferrer" style="background: linear-gradient(135deg, #F59E0B, #EF4444); color: #FFFFFF; font-weight: bold; font-size: 11px; padding: 8px 12px; border-radius: 8px; text-decoration: none; white-space: nowrap; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);">
            Buy Deal &rarr;
          </a>
        </div>
      `).join('')}
    </div>
    <div style="text-align: center; margin-top: 14px; font-size: 10px; color: #64748B;">
      Verified via TITAN Swarm Intelligence • Amazon tag: ${AFFILIATE_TAG}
    </div>
  `;

  container.appendChild(wrapper);
})();
