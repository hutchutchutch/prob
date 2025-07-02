import React from 'react';
import { Copy, Check, Link } from 'lucide-react';
import { Button } from '../common/Button';
import type { ShareLink } from '../../types/export.types';

interface ShareLinkGeneratorProps {
  shareLink: ShareLink;
  onCopy: () => void;
  copied: boolean;
}

export const ShareLinkGenerator: React.FC<ShareLinkGeneratorProps> = ({
  shareLink,
  onCopy,
  copied
}) => {
  return (
    <div className="share-link-generator">
      <div className="link-section">
        <h3 className="heading-3">Share Link</h3>
        <div className="link-container">
          <div className="link-input-wrapper">
            <Link className="icon-sm link-icon" />
            <input
              type="text"
              value={shareLink.url}
              readOnly
              className="link-input"
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
          <Button
            variant="secondary"
            onClick={onCopy}
            icon={copied ? <Check className="icon-sm" /> : <Copy className="icon-sm" />}
            className={copied ? 'copy-button copied' : 'copy-button'}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="link-info">
        <div className="info-item">
          <span className="info-label body-sm">Permission:</span>
          <span className="info-value">{shareLink.permission}</span>
        </div>
        {shareLink.expiresAt && (
          <div className="info-item">
            <span className="info-label body-sm">Expires:</span>
            <span className="info-value">
              {new Date(shareLink.expiresAt).toLocaleDateString()}
            </span>
          </div>
        )}
        <div className="info-item">
          <span className="info-label body-sm">Created:</span>
          <span className="info-value">
            {new Date(shareLink.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};