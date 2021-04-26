let expect = require('chai').expect;
const fetch = require('node-fetch');

// Test API call gives successful response
describe('API test', function() {
  it('should have an OK status response', async function() {
    this.timeout(20000);
    // Call API with input data
    const ok = await fetch('http://localhost:8080/api?username=alex')  
      .then(response => response.ok)
      .then(ok => ok)
    // Check response status is OK
    expect(ok).to.equal(true);
  });
});
