import React, { useState, useEffect, useRef } from 'react';
import { Position } from '@xyflow/react';
import BaseNode from './BaseNode';

interface HookNodeProps {
  data: any;
  id: string;
  updateData: (nodeId: string, newData: any) => void;
  onDelete?: (nodeId: string) => void;
}

export default function HookNode({ data, id, updateData, onDelete }: HookNodeProps) {
  const [type, setType] = useState(data.type || 'HOOKTYPE_LOCAL_CONNECT');
  const initializedRef = useRef(false);

  useEffect(() => {
    setType(data.type || 'HOOKTYPE_LOCAL_CONNECT');
    
    // Ensure functionName is always set (only once)
    if (!initializedRef.current && !data.functionName) {
      initializedRef.current = true;
      updateData(id, { type: data.type || 'HOOKTYPE_LOCAL_CONNECT', functionName: `hook_${id}` });
    }
  }, [data]);

  const handleBlur = () => {
    updateData(id, { type, functionName: `hook_${id}` });
  };

  return (
    <BaseNode
      id={id}
      onDelete={onDelete}
      handles={[
        { type: 'target', position: Position.Left, style: { width: '24px', height: '24px' }, className: 'bg-green-300 p-2 m-[-8px]', showIcon: true },
        { type: 'source', position: Position.Right, style: { width: '24px', height: '24px' }, className: 'bg-green-300 p-2 m-[-8px]', showIcon: true }
      ]}
    >
      <h3 className="m-0 mb-4 text-sm font-semibold text-green-300 text-center">
        Hook
      </h3>
      <div className="text-xs text-gray-300 mb-4 text-center">
        Event handler that runs when specific IRC events occur
      </div>
      <div className="flex flex-col gap-3">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          onBlur={handleBlur}
          data-no-drag
          className="bg-gray-700 text-white border border-gray-500 px-2 py-1 rounded-md w-full text-sm outline-none transition-colors duration-200 focus:border-green-300 max-h-[120px] overflow-y-auto"
        >
        <optgroup label="Connection Hooks">
          <option value="HOOKTYPE_PRE_LOCAL_CONNECT">HOOKTYPE_PRE_LOCAL_CONNECT</option>
          <option value="HOOKTYPE_LOCAL_CONNECT">HOOKTYPE_LOCAL_CONNECT</option>
          <option value="HOOKTYPE_REMOTE_CONNECT">HOOKTYPE_REMOTE_CONNECT</option>
          <option value="HOOKTYPE_PRE_LOCAL_QUIT">HOOKTYPE_PRE_LOCAL_QUIT</option>
          <option value="HOOKTYPE_LOCAL_QUIT">HOOKTYPE_LOCAL_QUIT</option>
          <option value="HOOKTYPE_REMOTE_QUIT">HOOKTYPE_REMOTE_QUIT</option>
          <option value="HOOKTYPE_UNKUSER_QUIT">HOOKTYPE_UNKUSER_QUIT</option>
          <option value="HOOKTYPE_CLOSE_CONNECTION">HOOKTYPE_CLOSE_CONNECTION</option>
          <option value="HOOKTYPE_FREE_CLIENT">HOOKTYPE_FREE_CLIENT</option>
          <option value="HOOKTYPE_FREE_USER">HOOKTYPE_FREE_USER</option>
          <option value="HOOKTYPE_HANDSHAKE">HOOKTYPE_HANDSHAKE</option>
          <option value="HOOKTYPE_IDENT_LOOKUP">HOOKTYPE_IDENT_LOOKUP</option>
          <option value="HOOKTYPE_IS_HANDSHAKE_FINISHED">HOOKTYPE_IS_HANDSHAKE_FINISHED</option>
          <option value="HOOKTYPE_PRE_LOCAL_HANDSHAKE_TIMEOUT">HOOKTYPE_PRE_LOCAL_HANDSHAKE_TIMEOUT</option>
          <option value="HOOKTYPE_SECURE_CONNECT">HOOKTYPE_SECURE_CONNECT</option>
          <option value="HOOKTYPE_ALLOW_CLIENT">HOOKTYPE_ALLOW_CLIENT</option>
          <option value="HOOKTYPE_BANNED_CLIENT">HOOKTYPE_BANNED_CLIENT</option>
        </optgroup>
        <optgroup label="Channel Hooks">
          <option value="HOOKTYPE_CAN_JOIN">HOOKTYPE_CAN_JOIN</option>
          <option value="HOOKTYPE_CAN_JOIN_LIMITEXCEEDED">HOOKTYPE_CAN_JOIN_LIMITEXCEEDED</option>
          <option value="HOOKTYPE_PRE_LOCAL_JOIN">HOOKTYPE_PRE_LOCAL_JOIN</option>
          <option value="HOOKTYPE_LOCAL_JOIN">HOOKTYPE_LOCAL_JOIN</option>
          <option value="HOOKTYPE_REMOTE_JOIN">HOOKTYPE_REMOTE_JOIN</option>
          <option value="HOOKTYPE_PRE_LOCAL_PART">HOOKTYPE_PRE_LOCAL_PART</option>
          <option value="HOOKTYPE_LOCAL_PART">HOOKTYPE_LOCAL_PART</option>
          <option value="HOOKTYPE_REMOTE_PART">HOOKTYPE_REMOTE_PART</option>
          <option value="HOOKTYPE_PRE_LOCAL_QUIT_CHAN">HOOKTYPE_PRE_LOCAL_QUIT_CHAN</option>
          <option value="HOOKTYPE_CAN_KICK">HOOKTYPE_CAN_KICK</option>
          <option value="HOOKTYPE_PRE_LOCAL_KICK">HOOKTYPE_PRE_LOCAL_KICK</option>
          <option value="HOOKTYPE_LOCAL_KICK">HOOKTYPE_LOCAL_KICK</option>
          <option value="HOOKTYPE_REMOTE_KICK">HOOKTYPE_REMOTE_KICK</option>
          <option value="HOOKTYPE_CAN_SAJOIN">HOOKTYPE_CAN_SAJOIN</option>
          <option value="HOOKTYPE_JOIN_DATA">HOOKTYPE_JOIN_DATA</option>
          <option value="HOOKTYPE_CHANNEL_CREATE">HOOKTYPE_CHANNEL_CREATE</option>
          <option value="HOOKTYPE_CHANNEL_DESTROY">HOOKTYPE_CHANNEL_DESTROY</option>
          <option value="HOOKTYPE_CHANNEL_SYNCED">HOOKTYPE_CHANNEL_SYNCED</option>
          <option value="HOOKTYPE_CHAN_PERMIT_NICK_CHANGE">HOOKTYPE_CHAN_PERMIT_NICK_CHANGE</option>
          <option value="HOOKTYPE_IS_CHANNEL_SECURE">HOOKTYPE_IS_CHANNEL_SECURE</option>
          <option value="HOOKTYPE_SEE_CHANNEL_IN_WHOIS">HOOKTYPE_SEE_CHANNEL_IN_WHOIS</option>
          <option value="HOOKTYPE_VIEW_TOPIC_OUTSIDE_CHANNEL">HOOKTYPE_VIEW_TOPIC_OUTSIDE_CHANNEL</option>
        </optgroup>
        <optgroup label="Message Hooks">
          <option value="HOOKTYPE_CAN_SEND_TO_CHANNEL">HOOKTYPE_CAN_SEND_TO_CHANNEL</option>
          <option value="HOOKTYPE_CAN_SEND_TO_USER">HOOKTYPE_CAN_SEND_TO_USER</option>
          <option value="HOOKTYPE_CAN_BYPASS_CHANNEL_MESSAGE_RESTRICTION">HOOKTYPE_CAN_BYPASS_CHANNEL_MESSAGE_RESTRICTION</option>
          <option value="HOOKTYPE_PRE_CHANMSG">HOOKTYPE_PRE_CHANMSG</option>
          <option value="HOOKTYPE_CHANMSG">HOOKTYPE_CHANMSG</option>
          <option value="HOOKTYPE_USERMSG">HOOKTYPE_USERMSG</option>
          <option value="HOOKTYPE_NEW_MESSAGE">HOOKTYPE_NEW_MESSAGE</option>
          <option value="HOOKTYPE_LOCAL_SPAMFILTER">HOOKTYPE_LOCAL_SPAMFILTER</option>
          <option value="HOOKTYPE_SILENCED">HOOKTYPE_SILENCED</option>
        </optgroup>
        <optgroup label="User Hooks">
          <option value="HOOKTYPE_LOCAL_NICKCHANGE">HOOKTYPE_LOCAL_NICKCHANGE</option>
          <option value="HOOKTYPE_REMOTE_NICKCHANGE">HOOKTYPE_REMOTE_NICKCHANGE</option>
          <option value="HOOKTYPE_POST_LOCAL_NICKCHANGE">HOOKTYPE_POST_LOCAL_NICKCHANGE</option>
          <option value="HOOKTYPE_POST_REMOTE_NICKCHANGE">HOOKTYPE_POST_REMOTE_NICKCHANGE</option>
          <option value="HOOKTYPE_REALNAME_CHANGE">HOOKTYPE_REALNAME_CHANGE</option>
          <option value="HOOKTYPE_USERHOST_CHANGE">HOOKTYPE_USERHOST_CHANGE</option>
          <option value="HOOKTYPE_CAN_USE_NICK">HOOKTYPE_CAN_USE_NICK</option>
          <option value="HOOKTYPE_AWAY">HOOKTYPE_AWAY</option>
          <option value="HOOKTYPE_LOCAL_OPER">HOOKTYPE_LOCAL_OPER</option>
          <option value="HOOKTYPE_LOCAL_PASS">HOOKTYPE_LOCAL_PASS</option>
          <option value="HOOKTYPE_UMODE_CHANGE">HOOKTYPE_UMODE_CHANGE</option>
          <option value="HOOKTYPE_IP_CHANGE">HOOKTYPE_IP_CHANGE</option>
          <option value="HOOKTYPE_ACCOUNT_LOGIN">HOOKTYPE_ACCOUNT_LOGIN</option>
        </optgroup>
        <optgroup label="Mode/Topic Hooks">
          <option value="HOOKTYPE_PRE_LOCAL_CHANMODE">HOOKTYPE_PRE_LOCAL_CHANMODE</option>
          <option value="HOOKTYPE_LOCAL_CHANMODE">HOOKTYPE_LOCAL_CHANMODE</option>
          <option value="HOOKTYPE_PRE_REMOTE_CHANMODE">HOOKTYPE_PRE_REMOTE_CHANMODE</option>
          <option value="HOOKTYPE_REMOTE_CHANMODE">HOOKTYPE_REMOTE_CHANMODE</option>
          <option value="HOOKTYPE_MODECHAR_ADD">HOOKTYPE_MODECHAR_ADD</option>
          <option value="HOOKTYPE_MODECHAR_DEL">HOOKTYPE_MODECHAR_DEL</option>
          <option value="HOOKTYPE_MODE_DEOP">HOOKTYPE_MODE_DEOP</option>
          <option value="HOOKTYPE_PRE_LOCAL_TOPIC">HOOKTYPE_PRE_LOCAL_TOPIC</option>
          <option value="HOOKTYPE_TOPIC">HOOKTYPE_TOPIC</option>
          <option value="HOOKTYPE_CAN_SET_TOPIC">HOOKTYPE_CAN_SET_TOPIC</option>
        </optgroup>
        <optgroup label="Server Hooks">
          <option value="HOOKTYPE_SERVER_CONNECT">HOOKTYPE_SERVER_CONNECT</option>
          <option value="HOOKTYPE_SERVER_HANDSHAKE_OUT">HOOKTYPE_SERVER_HANDSHAKE_OUT</option>
          <option value="HOOKTYPE_SERVER_SYNC">HOOKTYPE_SERVER_SYNC</option>
          <option value="HOOKTYPE_POST_SERVER_CONNECT">HOOKTYPE_POST_SERVER_CONNECT</option>
          <option value="HOOKTYPE_SERVER_SYNCED">HOOKTYPE_SERVER_SYNCED</option>
          <option value="HOOKTYPE_SERVER_QUIT">HOOKTYPE_SERVER_QUIT</option>
        </optgroup>
        <optgroup label="Invite/Knock Hooks">
          <option value="HOOKTYPE_PRE_INVITE">HOOKTYPE_PRE_INVITE</option>
          <option value="HOOKTYPE_INVITE">HOOKTYPE_INVITE</option>
          <option value="HOOKTYPE_INVITE_BYPASS">HOOKTYPE_INVITE_BYPASS</option>
          <option value="HOOKTYPE_IS_INVITED">HOOKTYPE_IS_INVITED</option>
          <option value="HOOKTYPE_PRE_KNOCK">HOOKTYPE_PRE_KNOCK</option>
          <option value="HOOKTYPE_KNOCK">HOOKTYPE_KNOCK</option>
        </optgroup>
        <optgroup label="Kill/Ban Hooks">
          <option value="HOOKTYPE_PRE_KILL">HOOKTYPE_PRE_KILL</option>
          <option value="HOOKTYPE_LOCAL_KILL">HOOKTYPE_LOCAL_KILL</option>
          <option value="HOOKTYPE_FIND_TKLINE_MATCH">HOOKTYPE_FIND_TKLINE_MATCH</option>
          <option value="HOOKTYPE_TKL_ADD">HOOKTYPE_TKL_ADD</option>
          <option value="HOOKTYPE_TKL_DEL">HOOKTYPE_TKL_DEL</option>
          <option value="HOOKTYPE_TKL_EXCEPT">HOOKTYPE_TKL_EXCEPT</option>
        </optgroup>
        <optgroup label="SASL/Auth Hooks">
          <option value="HOOKTYPE_SASL_AUTHENTICATE">HOOKTYPE_SASL_AUTHENTICATE</option>
          <option value="HOOKTYPE_SASL_CONTINUATION">HOOKTYPE_SASL_CONTINUATION</option>
          <option value="HOOKTYPE_SASL_MECHS">HOOKTYPE_SASL_MECHS</option>
          <option value="HOOKTYPE_SASL_RESULT">HOOKTYPE_SASL_RESULT</option>
        </optgroup>
        <optgroup label="DCC/Monitor Hooks">
          <option value="HOOKTYPE_DCC_DENIED">HOOKTYPE_DCC_DENIED</option>
          <option value="HOOKTYPE_MONITOR_NOTIFICATION">HOOKTYPE_MONITOR_NOTIFICATION</option>
          <option value="HOOKTYPE_WATCH_ADD">HOOKTYPE_WATCH_ADD</option>
          <option value="HOOKTYPE_WATCH_DEL">HOOKTYPE_WATCH_DEL</option>
        </optgroup>
        <optgroup label="Config/Rehash Hooks">
          <option value="HOOKTYPE_CONFIGPOSTTEST">HOOKTYPE_CONFIGPOSTTEST</option>
          <option value="HOOKTYPE_CONFIGRUN">HOOKTYPE_CONFIGRUN</option>
          <option value="HOOKTYPE_CONFIGRUN_EX">HOOKTYPE_CONFIGRUN_EX</option>
          <option value="HOOKTYPE_CONFIGTEST">HOOKTYPE_CONFIGTEST</option>
          <option value="HOOKTYPE_CONFIG_LISTENER">HOOKTYPE_CONFIG_LISTENER</option>
          <option value="HOOKTYPE_REHASH">HOOKTYPE_REHASH</option>
          <option value="HOOKTYPE_REHASH_COMPLETE">HOOKTYPE_REHASH_COMPLETE</option>
          <option value="HOOKTYPE_REHASHFLAG">HOOKTYPE_REHASHFLAG</option>
          <option value="HOOKTYPE_REHASH_LOG">HOOKTYPE_REHASH_LOG</option>
        </optgroup>
        <optgroup label="Stats/Logging Hooks">
          <option value="HOOKTYPE_STATS">HOOKTYPE_STATS</option>
          <option value="HOOKTYPE_LOG">HOOKTYPE_LOG</option>
          <option value="HOOKTYPE_WHOIS">HOOKTYPE_WHOIS</option>
          <option value="HOOKTYPE_WHO_STATUS">HOOKTYPE_WHO_STATUS</option>
          <option value="HOOKTYPE_TAKE_ACTION">HOOKTYPE_TAKE_ACTION</option>
        </optgroup>
        <optgroup label="JSON/API Hooks">
          <option value="HOOKTYPE_JSON_EXPAND_CLIENT">HOOKTYPE_JSON_EXPAND_CLIENT</option>
          <option value="HOOKTYPE_JSON_EXPAND_CLIENT_USER">HOOKTYPE_JSON_EXPAND_CLIENT_USER</option>
          <option value="HOOKTYPE_JSON_EXPAND_CLIENT_SERVER">HOOKTYPE_JSON_EXPAND_CLIENT_SERVER</option>
          <option value="HOOKTYPE_JSON_EXPAND_CHANNEL">HOOKTYPE_JSON_EXPAND_CHANNEL</option>
        </optgroup>
        <optgroup label="Network/Packet Hooks">
          <option value="HOOKTYPE_PACKET">HOOKTYPE_PACKET</option>
          <option value="HOOKTYPE_RAWPACKET_IN">HOOKTYPE_RAWPACKET_IN</option>
          <option value="HOOKTYPE_DNS_FINISHED">HOOKTYPE_DNS_FINISHED</option>
          <option value="HOOKTYPE_CONNECT_EXTINFO">HOOKTYPE_CONNECT_EXTINFO</option>
          <option value="HOOKTYPE_ACCEPT">HOOKTYPE_ACCEPT</option>
        </optgroup>
        <optgroup label="Command Hooks">
          <option value="HOOKTYPE_PRE_COMMAND">HOOKTYPE_PRE_COMMAND</option>
          <option value="HOOKTYPE_POST_COMMAND">HOOKTYPE_POST_COMMAND</option>
          <option value="HOOKTYPE_ANALYZE_TEXT">HOOKTYPE_ANALYZE_TEXT</option>
        </optgroup>
        <optgroup label="Welcome/Other Hooks">
          <option value="HOOKTYPE_WELCOME">HOOKTYPE_WELCOME</option>
        </optgroup>
      </select>
      </div>
    </BaseNode>
  );
}