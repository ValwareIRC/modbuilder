import React, { useState, useEffect } from 'react';
import BaseNode from './BaseNode';

interface ISupportTokenNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

const COMMON_ISUPPORT_TOKENS = [
  { value: 'CHANTYPES', label: 'CHANTYPES - Channel prefix chars', example: '#&+!' },
  { value: 'PREFIX', label: 'PREFIX - User mode prefixes', example: '(ov)@+' },
  { value: 'CHANMODES', label: 'CHANMODES - Channel mode types', example: 'b,k,l,imnpst' },
  { value: 'MODES', label: 'MODES - Max modes per command', example: '4' },
  { value: 'MAXCHANNELS', label: 'MAXCHANNELS - Max channels per user', example: '20' },
  { value: 'NICKLEN', label: 'NICKLEN - Max nickname length', example: '30' },
  { value: 'TOPICLEN', label: 'TOPICLEN - Max topic length', example: '390' },
  { value: 'KICKLEN', label: 'KICKLEN - Max kick message length', example: '390' },
  { value: 'NETWORK', label: 'NETWORK - Network name', example: 'MyNetwork' },
  { value: 'CASEMAPPING', label: 'CASEMAPPING - Case mapping', example: 'rfc1459' },
  { value: 'MAXLIST', label: 'MAXLIST - Max list items', example: 'b:100,e:100,I:100' },
  { value: 'EXCEPTS', label: 'EXCEPTS - Exception mode char', example: 'e' },
  { value: 'INVEX', label: 'INVEX - Invite exception char', example: 'I' },
  { value: 'STATUSMSG', label: 'STATUSMSG - Status message prefix', example: '@+' },
  { value: 'ELIST', label: 'ELIST - Extended list modes', example: 'U' },
  { value: 'SAFELIST', label: 'SAFELIST - Safe list support', example: '' },
  { value: 'CUSTOM', label: 'Custom Token', example: '' }
];

export default function ISupportTokenNode({ data, id, updateData, onDelete }: ISupportTokenNodeProps) {
  const [tokenType, setTokenType] = useState(data.tokenType || 'CHANTYPES');
  const [customToken, setCustomToken] = useState(data.customToken || '');
  const [tokenValue, setTokenValue] = useState(data.tokenValue || '');
  const [description, setDescription] = useState(data.description || '');

  useEffect(() => {
    setTokenType(data.tokenType || 'CHANTYPES');
    setCustomToken(data.customToken || '');
    setTokenValue(data.tokenValue || '');
    setDescription(data.description || '');
  }, [data]);

  const handleBlur = () => {
    updateData(id, { tokenType, customToken, tokenValue, description });
  };

  const selectedToken = COMMON_ISUPPORT_TOKENS.find(t => t.value === tokenType);
  const currentTokenName = tokenType === 'CUSTOM' ? customToken : tokenType;

  return (
    <BaseNode id={id} onDelete={onDelete}>
      <h3 className="m-0 mb-4 text-sm font-semibold text-cyan-300 text-center">
        ISUPPORT Token
      </h3>
      <div className="flex flex-col gap-3">
        <select
          value={tokenType}
          onChange={(e) => setTokenType(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-cyan-300"
        >
          {COMMON_ISUPPORT_TOKENS.map(token => (
            <option key={token.value} value={token.value}>
              {token.label}
            </option>
          ))}
        </select>

        {tokenType === 'CUSTOM' && (
          <input
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            onBlur={handleBlur}
            data-no-drag
            placeholder="Custom token name"
            className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-cyan-300"
          />
        )}

        <input
          value={tokenValue}
          onChange={(e) => setTokenValue(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder={selectedToken?.example || "Token value"}
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-cyan-300"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          placeholder="Optional description"
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded text-xs outline-none transition-colors duration-200 focus:border-cyan-300"
        />

        {selectedToken && (
          <div className="text-xs text-gray-400 bg-gray-800 p-2 rounded">
            <strong>{currentTokenName}:</strong> {selectedToken.label.split(' - ')[1]}
            {selectedToken.example && (
              <div className="mt-1">
                <strong>Example:</strong> {selectedToken.example}
              </div>
            )}
          </div>
        )}
      </div>
    </BaseNode>
  );
}