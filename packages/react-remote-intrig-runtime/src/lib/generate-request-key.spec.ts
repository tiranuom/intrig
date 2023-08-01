import {NetworkRequest} from "@intrig/react-remote-intrig-runtime";
import {generateRequestKey} from "./generate-request-key";
import {NetworkRequestMetadata} from "./network-request";

describe('generateRequestKey', () => {
    it('should generate expected key for request without headers or key', () => {
        const req: NetworkRequestMetadata = {
            domain: 'local',
            method: 'GET',
            url: 'http://example.com/'
        };

        const key = generateRequestKey(req);
        expect(key).toBe('[local] GET http://example.com/');
    });

    it('should generate expected key for request with headers but without key', () => {
        const req: NetworkRequestMetadata = {
            domain: 'local',
            method: 'GET',
            url: 'http://example.com/',
            headers: { 'Content-Type': 'application/json' }
        };

        const key = generateRequestKey(req);
        expect(key).toBe('[local] GET http://example.com/ application/json');
    });

    it('should generate expected key for request with key but without headers', () => {
        const req: NetworkRequestMetadata = {
            domain: 'local',
            method: 'GET',
            url: 'http://example.com/',
            key: 'special-request'
        };

        const key = generateRequestKey(req);
        expect(key).toBe('[local] GET http://example.com/ (special-request)');
    });

    it('should generate expected key for request with both headers and key', () => {
        const req: NetworkRequestMetadata = {
            domain: 'local',
            method: 'GET',
            url: 'http://example.com/',
            headers: { 'Content-Type': 'application/json' },
            key: 'special-request'
        };

        const key = generateRequestKey(req);
        expect(key).toBe('[local] GET http://example.com/ application/json (special-request)');
    });
});
