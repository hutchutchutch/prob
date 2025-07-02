import React, { useState, useCallback } from 'react';
import { X, Copy, Check, Clock, Eye, Edit2, MessageSquare, QrCode } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ShareLinkGenerator } from './ShareLinkGenerator';
import { useShareLink } from '../../hooks/useShareLink';
import type { SharePermission } from '../../types/export.types';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName
}) => {
  const [permission, setPermission] = useState<SharePermission>('view');
  const [expiresIn, setExpiresIn] = useState<number>(7); // days
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const { generateShareLink, shareLink, isGenerating, accessHistory } = useShareLink();

  const handleGenerateLink = useCallback(async () => {
    await generateShareLink(projectId, {
      permission,
      expiresIn: expiresIn * 24 * 60 * 60 * 1000 // Convert days to milliseconds
    });
  }, [projectId, permission, expiresIn, generateShareLink]);

  const handleCopyLink = useCallback(() => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareLink]);

  const permissionIcons = {
    view: <Eye className="icon-sm" />,
    comment: <MessageSquare className="icon-sm" />,
    edit: <Edit2 className="icon-sm" />
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="share-dialog">
        <div className="share-dialog-header">
          <h2 className="heading-2">Share Project</h2>
          <button onClick={onClose} className="btn-icon btn-icon--small">
            <X className="icon" />
          </button>
        </div>

        <div className="share-dialog-content">
          <div className="share-section">
            <h3 className="heading-3">Permission Level</h3>
            <div className="permission-options">
              {(['view', 'comment', 'edit'] as SharePermission[]).map(perm => (
                <button
                  key={perm}
                  className={`permission-option ${permission === perm ? 'permission-option--selected' : ''}`}
                  onClick={() => setPermission(perm)}
                >
                  {permissionIcons[perm]}
                  <span className="permission-label">{perm.charAt(0).toUpperCase() + perm.slice(1)}</span>
                  <span className="permission-desc body-sm">
                    {perm === 'view' && 'Read-only access'}
                    {perm === 'comment' && 'Can add comments'}
                    {perm === 'edit' && 'Full edit access'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="share-section">
            <h3 className="heading-3">Expiration</h3>
            <div className="expiration-options">
              <Clock className="icon-sm" />
              <select
                value={expiresIn}
                onChange={(e) => setExpiresIn(Number(e.target.value))}
                className="expiration-select"
              >
                <option value={1}>1 day</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={0}>Never</option>
              </select>
            </div>
          </div>

          {!shareLink && (
            <div className="share-section">
              <Button
                variant="primary"
                onClick={handleGenerateLink}
                disabled={isGenerating}
                className="generate-button"
              >
                {isGenerating ? 'Generating...' : 'Generate Share Link'}
              </Button>
            </div>
          )}

          {shareLink && (
            <>
              <ShareLinkGenerator
                shareLink={shareLink}
                onCopy={handleCopyLink}
                copied={copied}
              />

              <div className="share-section">
                <Button
                  variant="secondary"
                  onClick={() => setShowQR(!showQR)}
                  icon={<QrCode className="icon-sm" />}
                >
                  {showQR ? 'Hide' : 'Show'} QR Code
                </Button>
              </div>

              {showQR && (
                <div className="qr-section">
                  <div className="qr-code">
                    {/* QR code would be generated here */}
                    <div className="qr-placeholder">
                      <QrCode size={120} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {accessHistory.length > 0 && (
            <div className="share-section">
              <h3 className="heading-3">Access History</h3>
              <div className="access-history">
                {accessHistory.slice(0, 5).map((entry, index) => (
                  <div key={index} className="history-entry">
                    <div className="history-info">
                      <span className="history-user">{entry.userEmail || 'Anonymous'}</span>
                      <span className="history-permission body-sm">{entry.permission}</span>
                    </div>
                    <span className="history-time body-sm">
                      {new Date(entry.accessedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="share-dialog-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};