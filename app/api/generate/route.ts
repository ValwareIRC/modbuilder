import { NextRequest, NextResponse } from 'next/server';

function resolvePlaceholder(placeholder: string): string {
  // Remove the $ prefix
  const path = placeholder.substring(1);
  
  // Common mappings
  const mappings: { [key: string]: string } = {
    'client': 'client',
    'client.name': 'client->name',
    'client.info': 'client->info',
    'client.user': 'client->user',
    'client.user.username': 'client->user->username',
    'client.user.realname': 'client->user->realname',
    'client.user.hostname': 'client->user->hostname',
    'me': 'me',
    'me.name': 'me.name',
    'me.info': 'me.info',
  };
  
  return mappings[path] || placeholder;
}

function processMessageWithPlaceholders(message: string): { formatString: string, args: string[] } {
  // Find all $placeholder patterns
  const placeholderRegex = /\$[a-zA-Z_][a-zA-Z0-9_.]*/g;
  const placeholders = message.match(placeholderRegex) || [];
  
  let formatString = message;
  const args: string[] = [];
  
  placeholders.forEach(placeholder => {
    const resolved = resolvePlaceholder(placeholder);
    formatString = formatString.replace(placeholder, '%s');
    args.push(resolved);
  });
  
  return { formatString, args };
}

export async function POST(request: NextRequest) {
  const { nodes, edges } = await request.json();

  // Parse nodes to build module code
  let moduleName = 'third/example';
  let version = '1.0';
  let author = 'Generated';
  let commands: any[] = [];
  let hooks: any[] = [];
  let capabilities: any[] = [];
  let sendMessages: any[] = [];
  let rpcEndpoints: any[] = [];
  let isupportTokens: any[] = [];
  let userModes: any[] = [];

  nodes.forEach((node: any) => {
    if (node.type === 'moduleInfo') {
      moduleName = node.data.moduleName || moduleName;
      version = node.data.version || version;
      author = node.data.author || author;
    } else if (node.type === 'command') {
      commands.push({ name: node.data.name, logic: node.data.logic, functionName: `${node.data.name.toUpperCase()}` });
    } else if (node.type === 'hook') {
      hooks.push({ type: node.data.type, functionName: node.data.functionName || `hook_${node.id}` });
    } else if (node.type === 'capability') {
      capabilities.push({ name: node.data.name });
    } else if (node.type === 'sendMessage') {
      sendMessages.push({
        id: node.id,
        messageType: node.data.messageType || 'notice',
        message: node.data.message || '',
        target: node.data.target || '$client'
      });
    } else if (node.type === 'rpcEndpoint') {
      rpcEndpoints.push({
        endpoint: node.data.endpoint || '',
        method: node.data.method || 'POST',
        description: node.data.description || '',
        parameters: node.data.parameters || '',
        responseType: node.data.responseType || 'json'
      });
    } else if (node.type === 'isupportToken') {
      const tokenName = node.data.tokenType === 'CUSTOM' ? node.data.customToken : node.data.tokenType;
      isupportTokens.push({
        token: tokenName,
        value: node.data.tokenValue || '',
        description: node.data.description || ''
      });
    } else if (node.type === 'userMode') {
      userModes.push({
        modeChar: node.data.modeChar || '',
        modeFlags: node.data.modeFlags || 'UMODE_GLOBAL'
      });
    }
  });

  // Generate C code
  let code = `/* 
        LICENSE: GPLv3-or-later
        Copyright Ⓒ 2023 ${author}

*/

/*** <<<MODULE MANAGER START>>>
module
{
                documentation "https://example.com";
                troubleshooting "In case of problems, e-mail me";
                min-unrealircd-version "6.*";
                max-unrealircd-version "6.*";
                post-install-text {
                                "The module is installed. Now all you need to do is add a loadmodule line:";
                                "loadmodule \"${moduleName}\";";
                                "And /REHASH the IRCd.";
                                "The module does not need any other configuration.";
                }
}
*** <<<MODULE MANAGER END>>>
*/
#include "unrealircd.h"

ModuleHeader MOD_HEADER
  = {
        "${moduleName}",
        "${version}",
        "Generated module", 
        "${author}",
        "unrealircd-6",
};

`;

  // Add user mode global variables
  userModes.forEach((mode, index) => {
    code += `long UMODE_${mode.modeChar.toUpperCase()} = 0L;\n`;
  });

  code += `
MOD_INIT()
{
`;

  capabilities.forEach((cap) => {
    code += `        ClientCapabilityInfo cap_${cap.name};
        memset(&cap_${cap.name}, 0, sizeof(cap_${cap.name}));
        cap_${cap.name}.name = ${cap.name.toUpperCase()}_CAP;
        ClientCapabilityAdd(modinfo->handle, &cap_${cap.name}, &CAP_${cap.name.toUpperCase()});
`;
  });

  hooks.forEach((hook) => {
    code += `        HookAdd(modinfo->handle, ${hook.type}, 0, ${hook.functionName});
`;
  });

  commands.forEach((cmd) => {
    code += `        CommandAdd(modinfo->handle, CMD_${cmd.name.toUpperCase()}, ${cmd.functionName}, 0, ${cmd.flags || 'CMD_USER'});
`;
  });

  // Initialize RPC endpoints
  rpcEndpoints.forEach((endpoint, index) => {
    code += `        // RPC Endpoint: ${endpoint.endpoint} (${endpoint.method})
        // ${endpoint.description}
`;
  });

  // Initialize ISUPPORT tokens
  isupportTokens.forEach((token, index) => {
    code += `        // ISUPPORT Token: ${token.token} = ${token.value}
        // ${token.description}
        ISupportAdd(modinfo->handle, "${token.token}", "${token.value}");
`;
  });

  // Initialize user modes
  userModes.forEach((mode, index) => {
    code += `        UmodeAdd(modinfo->handle, '${mode.modeChar}', ${mode.modeFlags}, 0, NULL, &UMODE_${mode.modeChar.toUpperCase()});
`;
  });

  code += `        return MOD_SUCCESS;
}

MOD_LOAD()
{
        return MOD_SUCCESS;
}

MOD_UNLOAD()
{
        return MOD_SUCCESS;
}
`;

  // Add command functions
  commands.forEach((cmd) => {
    code += `
CMD_FUNC(${cmd.name.toUpperCase()})
{
    // Command logic here
`;

    // Build command logic from connected nodes
    const commandNode = nodes.find((n: any) => n.data.name === cmd.name);
    if (commandNode) {
      code += generateCommandLogic(commandNode, nodes, edges, 1);
    }

    code += `
    sendto_one(client, NULL, ":%s NOTICE %s :Command executed", me.name, client->name);
}
`;
  });

  // Add hook functions
  hooks.forEach((hook) => {
    let functionSignature = `int ${hook.functionName}(Client *client)`;
    let comment = `// ${hook.logic || 'Hook logic here'}`;
    
    // Different hook types have different signatures
    switch (hook.type) {
      // Channel-related hooks
      case 'HOOKTYPE_LOCAL_JOIN':
      case 'HOOKTYPE_REMOTE_JOIN':
      case 'HOOKTYPE_PRE_LOCAL_JOIN':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, MessageTag *mtags)`;
        comment = `// ${hook.logic || 'Handle channel join event'}`;
        break;
      case 'HOOKTYPE_LOCAL_PART':
      case 'HOOKTYPE_REMOTE_PART':
      case 'HOOKTYPE_PRE_LOCAL_PART':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, char *comment)`;
        comment = `// ${hook.logic || 'Handle channel part event'}`;
        break;
      case 'HOOKTYPE_LOCAL_KICK':
      case 'HOOKTYPE_REMOTE_KICK':
      case 'HOOKTYPE_PRE_LOCAL_KICK':
        functionSignature = `int ${hook.functionName}(Client *client, Client *victim, Channel *channel, char *comment, char *kickby)`;
        comment = `// ${hook.logic || 'Handle kick event'}`;
        break;
      case 'HOOKTYPE_CHANMSG':
      case 'HOOKTYPE_USERMSG':
      case 'HOOKTYPE_PRE_CHANMSG':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, char *text, int notice)`;
        comment = `// ${hook.logic || 'Handle message event'}`;
        break;
      case 'HOOKTYPE_LOCAL_CHANMODE':
      case 'HOOKTYPE_REMOTE_CHANMODE':
      case 'HOOKTYPE_PRE_LOCAL_CHANMODE':
      case 'HOOKTYPE_PRE_REMOTE_CHANMODE':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, MessageTag *mtags, char *modebuf, char *parabuf, time_t sendts, int samode)`;
        comment = `// ${hook.logic || 'Handle channel mode change'}`;
        break;
      case 'HOOKTYPE_TOPIC':
      case 'HOOKTYPE_PRE_LOCAL_TOPIC':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, char *topic)`;
        comment = `// ${hook.logic || 'Handle topic change'}`;
        break;
      case 'HOOKTYPE_LOCAL_NICKCHANGE':
      case 'HOOKTYPE_REMOTE_NICKCHANGE':
      case 'HOOKTYPE_POST_LOCAL_NICKCHANGE':
      case 'HOOKTYPE_POST_REMOTE_NICKCHANGE':
        functionSignature = `int ${hook.functionName}(Client *client, char *oldnick)`;
        comment = `// ${hook.logic || 'Handle nick change'}`;
        break;
      case 'HOOKTYPE_INVITE':
      case 'HOOKTYPE_PRE_INVITE':
        functionSignature = `int ${hook.functionName}(Client *client, Client *target, Channel *channel)`;
        comment = `// ${hook.logic || 'Handle invite'}`;
        break;
      case 'HOOKTYPE_KNOCK':
      case 'HOOKTYPE_PRE_KNOCK':
        functionSignature = `int ${hook.functionName}(Client *client, Channel *channel, char *comment)`;
        comment = `// ${hook.logic || 'Handle knock'}`;
        break;
      case 'HOOKTYPE_PRE_KILL':
      case 'HOOKTYPE_LOCAL_KILL':
        functionSignature = `int ${hook.functionName}(Client *client, Client *target, char *reason)`;
        comment = `// ${hook.logic || 'Handle kill'}`;
        break;
      case 'HOOKTYPE_AWAY':
        functionSignature = `int ${hook.functionName}(Client *client, char *reason)`;
        comment = `// ${hook.logic || 'Handle away status change'}`;
        break;
      case 'HOOKTYPE_WHOIS':
        functionSignature = `int ${hook.functionName}(Client *client, Client *target, int parc, char *parv[])`;
        comment = `// ${hook.logic || 'Handle whois query'}`;
        break;
      case 'HOOKTYPE_STATS':
        functionSignature = `int ${hook.functionName}(Client *client, char *stats_type, int parc, char *parv[])`;
        comment = `// ${hook.logic || 'Handle stats query'}`;
        break;
      case 'HOOKTYPE_PRE_COMMAND':
      case 'HOOKTYPE_POST_COMMAND':
        functionSignature = `int ${hook.functionName}(Client *client, int parc, char *parv[], int notice)`;
        comment = `// ${hook.logic || 'Handle command'}`;
        break;
      case 'HOOKTYPE_CONFIGTEST':
        functionSignature = `int ${hook.functionName}(ConfigFile *cf, ConfigEntry *ce, int type, int *result)`;
        comment = `// ${hook.logic || 'Validate configuration'}`;
        break;
      case 'HOOKTYPE_CONFIGRUN':
      case 'HOOKTYPE_CONFIGRUN_EX':
        functionSignature = `int ${hook.functionName}(ConfigFile *cf, ConfigEntry *ce, int type)`;
        comment = `// ${hook.logic || 'Process configuration'}`;
        break;
      case 'HOOKTYPE_REHASH':
        functionSignature = `int ${hook.functionName}(int sig)`;
        comment = `// ${hook.logic || 'Handle rehash'}`;
        break;
      case 'HOOKTYPE_LOG':
        functionSignature = `int ${hook.functionName}(int level, char *msg)`;
        comment = `// ${hook.logic || 'Handle logging'}`;
        break;
      case 'HOOKTYPE_PACKET':
        functionSignature = `int ${hook.functionName}(Client *client, char *buffer, int length)`;
        comment = `// ${hook.logic || 'Handle raw packet'}`;
        break;
      case 'HOOKTYPE_RAWPACKET_IN':
        functionSignature = `int ${hook.functionName}(Client *client, char *buffer, int *length)`;
        comment = `// ${hook.logic || 'Handle incoming raw packet'}`;
        break;
      case 'HOOKTYPE_SASL_AUTHENTICATE':
        functionSignature = `int ${hook.functionName}(Client *client, char *data, int length)`;
        comment = `// ${hook.logic || 'Handle SASL authentication'}`;
        break;
      case 'HOOKTYPE_SASL_CONTINUATION':
        functionSignature = `int ${hook.functionName}(Client *client, char *data, int length)`;
        comment = `// ${hook.logic || 'Handle SASL continuation'}`;
        break;
      case 'HOOKTYPE_SASL_MECHS':
        functionSignature = `int ${hook.functionName}(Client *client)`;
        comment = `// ${hook.logic || 'List SASL mechanisms'}`;
        break;
      case 'HOOKTYPE_SASL_RESULT':
        functionSignature = `int ${hook.functionName}(Client *client, int result)`;
        comment = `// ${hook.logic || 'Handle SASL result'}`;
        break;
      case 'HOOKTYPE_MONITOR_NOTIFICATION':
        functionSignature = `int ${hook.functionName}(Client *client, Watch *watch, Link *lp, int event, void *data)`;
        comment = `// ${hook.logic || 'Handle monitor notification'}`;
        break;
      case 'HOOKTYPE_WATCH_ADD':
      case 'HOOKTYPE_WATCH_DEL':
        functionSignature = `int ${hook.functionName}(Client *client, Client *target)`;
        comment = `// ${hook.logic || 'Handle watch list change'}`;
        break;
      case 'HOOKTYPE_DNS_FINISHED':
        functionSignature = `int ${hook.functionName}(Client *client, int status)`;
        comment = `// ${hook.logic || 'Handle DNS lookup completion'}`;
        break;
      case 'HOOKTYPE_CONNECT_EXTINFO':
        functionSignature = `int ${hook.functionName}(Client *client, char *hostname, char *ip, char *username)`;
        comment = `// ${hook.logic || 'Handle connection extended info'}`;
        break;
      case 'HOOKTYPE_ACCEPT':
        functionSignature = `int ${hook.functionName}(int fd, struct sockaddr *sa, int len)`;
        comment = `// ${hook.logic || 'Handle socket accept'}`;
        break;
      case 'HOOKTYPE_WELCOME':
        functionSignature = `int ${hook.functionName}(Client *client, int after_numeric)`;
        comment = `// ${hook.logic || 'Handle welcome message'}`;
        break;
      // Default case for simple hooks
      default:
        functionSignature = `int ${hook.functionName}(Client *client)`;
        comment = `// ${hook.logic || 'Hook logic here'}`;
        break;
    }
    
    code += `
${functionSignature}
{
`;

    // Build hook logic from connected nodes
    const hookNode = nodes.find((n: any) => n.data.functionName === hook.functionName);
    if (hookNode) {
      code += generateCommandLogic(hookNode, nodes, edges, 1);
    }

    code += `
    return 0;
}
`;
  });

  // Create filename from module name (take last part after splitting by '/')
  const filename = moduleName.split('/').pop() || 'module';

  return NextResponse.json({
    code,
    filename: `${filename}.c`,
    moduleName,
    version,
    author
  });
}

// Helper function to generate command logic from node connections
function generateCommandLogic(node: any, allNodes: any[], allEdges: any[], indentLevel: number): string {
  let code = '';
  const indent = '    '.repeat(indentLevel);
  
  if (node.type === 'stringConcat') {
    // Handle string concatenation
    const input1Edge = allEdges.find((e: any) => e.target === node.id && e.targetHandle === 'input1');
    const input2Edge = allEdges.find((e: any) => e.target === node.id && e.targetHandle === 'input2');
    
    let input1 = '"default"';
    let input2 = '"string"';
    
    if (input1Edge) {
      const input1Node = allNodes.find((n: any) => n.id === input1Edge.source);
      if (input1Node) {
        if (input1Node.type === 'stringConcat') {
          // This would be complex - for now just use a placeholder
          input1 = '"concatenated1"';
        } else {
          input1 = `"${input1Node.data.value || 'value'}"`;
        }
      }
    }
    
    if (input2Edge) {
      const input2Node = allNodes.find((n: any) => n.id === input2Edge.source);
      if (input2Node) {
        if (input2Node.type === 'stringConcat') {
          input2 = '"concatenated2"';
        } else {
          input2 = `"${input2Node.data.value || 'value'}"`;
        }
      }
    }
    
    code += `${indent}char *concat_result = malloc(strlen(${input1}) + strlen(${input2}) + 1);\n`;
    code += `${indent}strcpy(concat_result, ${input1});\n`;
    code += `${indent}strcat(concat_result, ${input2});\n`;
    
    // Continue with connected nodes
    const outgoingEdges = allEdges.filter((e: any) => e.source === node.id);
    outgoingEdges.forEach((edge: any) => {
      const targetNode = allNodes.find((n: any) => n.id === edge.target);
      if (targetNode) {
        code += generateCommandLogic(targetNode, allNodes, allEdges, indentLevel);
      }
    });
    
  } else if (node.type === 'sendMessage') {
    // Handle send message
    const messageType = node.data.messageType || 'notice';
    const message = node.data.message || '';
    const target = resolvePlaceholder(node.data.target || '$client');
    
    if (message) {
      const { formatString, args } = processMessageWithPlaceholders(message);
      
      if (messageType === 'notice') {
        // sendnotice(target, formatString, args...)
        code += `${indent}sendnotice(${target}, "${formatString}"`;
        if (args.length > 0) {
          code += `, ${args.join(', ')}`;
        }
        code += `);\n`;
      } else if (messageType === 'raw') {
        // sendto_one(target, NULL, formatString, args...)
        code += `${indent}sendto_one(${target}, NULL, "${formatString}"`;
        if (args.length > 0) {
          code += `, ${args.join(', ')}`;
        }
        code += `);\n`;
      }
    }
    
    // Continue with connected nodes
    const outgoingEdges = allEdges.filter((e: any) => e.source === node.id);
    outgoingEdges.forEach((edge: any) => {
      const targetNode = allNodes.find((n: any) => n.id === edge.target);
      if (targetNode) {
        code += generateCommandLogic(targetNode, allNodes, allEdges, indentLevel);
      }
    });
    
  } else if (node.type === 'log') {
    // Handle log message
    const logLevel = node.data.logLevel || 'ULOG_INFO';
    const subsystem = node.data.subsystem || 'module';
    const eventId = node.data.eventId || '';
    const message = node.data.message || '';
    
    if (message) {
      const { formatString, args } = processMessageWithPlaceholders(message);
      
      // Generate unreal_log call with correct format: unreal_log(level, subsystem, event_id, client, message, ...args)
      code += `${indent}unreal_log(${logLevel}, "${subsystem}", ${eventId ? `"${eventId}"` : 'NULL'}, NULL,\n`;
      code += `${indent}           "${formatString}"`;
      
      // Add structured logging parameters from message placeholders
      if (args.length > 0) {
        code += `,\n`;
        args.forEach((arg, index) => {
          code += `${indent}           log_data_string("${arg.replace(/[^a-zA-Z0-9_]/g, '_')}", ${arg})`;
          if (index < args.length - 1) {
            code += `,\n`;
          }
        });
      }
      
      code += `);\n`;
    }
    
    // Continue with connected nodes
    const outgoingEdges = allEdges.filter((e: any) => e.source === node.id);
    outgoingEdges.forEach((edge: any) => {
      const targetNode = allNodes.find((n: any) => n.id === edge.target);
      if (targetNode) {
        code += generateCommandLogic(targetNode, allNodes, allEdges, indentLevel);
      }
    });
    
  } else if (node.type === 'return') {
    const returnValue = node.data.value?.trim();
    if (returnValue) {
      code += `${indent}return ${returnValue};\n`;
    } else {
      code += `${indent}return;\n`;
    }
  } else {
    // For other node types, just continue with connected nodes
    const outgoingEdges = allEdges.filter((e: any) => e.source === node.id);
    outgoingEdges.forEach((edge: any) => {
      const targetNode = allNodes.find((n: any) => n.id === edge.target);
      if (targetNode) {
        if (targetNode.type === 'if') {
          const param1 = targetNode.data.param1 || 'parv[1]';
          const operator = targetNode.data.operator || '==';
          const param2 = targetNode.data.param2 || 'NULL';
          
          // Convert operator to C syntax
          let cOperator = operator;
          switch (operator) {
            case '==': cOperator = '=='; break;
            case '!=': cOperator = '!='; break;
            case '>': cOperator = '>'; break;
            case '<': cOperator = '<'; break;
            case '>=': cOperator = '>='; break;
            case '<=': cOperator = '<='; break;
            case 'contains': cOperator = 'strstr'; break;
            case 'not_null': cOperator = '!='; break;
            case 'is_null': cOperator = '=='; break;
            default: cOperator = operator;
          }
          
          // Generate appropriate condition
          let condition;
          if (operator === 'contains') {
            condition = `strstr(${param1}, ${param2}) != NULL`;
          } else if (operator === 'not_null') {
            condition = `${param1} != NULL`;
          } else if (operator === 'is_null') {
            condition = `${param1} == NULL`;
          } else {
            condition = `${param1} ${cOperator} ${param2}`;
          }
          
          code += `${indent}if (${condition}) {\n`;
          
          // Handle true branch
          const trueEdge = allEdges.find((e: any) => e.source === targetNode.id && e.sourceHandle === 'true');
          if (trueEdge) {
            const trueNode = allNodes.find((n: any) => n.id === trueEdge.target);
            if (trueNode) {
              code += generateCommandLogic(trueNode, allNodes, allEdges, indentLevel + 1);
            }
          }
          
          code += `${indent}} else {\n`;
          
          // Handle false branch
          const falseEdge = allEdges.find((e: any) => e.source === targetNode.id && e.sourceHandle === 'false');
          if (falseEdge) {
            const falseNode = allNodes.find((n: any) => n.id === falseEdge.target);
            if (falseNode) {
              code += generateCommandLogic(falseNode, allNodes, allEdges, indentLevel + 1);
            }
          }
          
          code += `${indent}}\n`;
          
        } else if (targetNode.type === 'switch') {
          const expression = targetNode.data.expression || 'parv[1]';
          const outputCount = targetNode.data.outputCount || 2;
          const caseValues = targetNode.data.caseValues || Array(outputCount).fill('').map((_, i) => i.toString());
          
          code += `${indent}switch (${expression}) {\n`;
          
          // Handle each case branch
          for (let i = 0; i < outputCount; i++) {
            const caseValue = caseValues[i] || i.toString();
            code += `${indent}case ${caseValue}:\n`;
            
            const caseEdge = allEdges.find((e: any) => e.source === targetNode.id && e.sourceHandle === `output-${i}`);
            if (caseEdge) {
              const caseNode = allNodes.find((n: any) => n.id === caseEdge.target);
              if (caseNode) {
                code += generateCommandLogic(caseNode, allNodes, allEdges, indentLevel + 1);
              }
            }
            
            code += `${indent}  break;\n`;
          }
          
          code += `${indent}}\n`;
          
        } else {
          code += generateCommandLogic(targetNode, allNodes, allEdges, indentLevel);
        }
      }
    });
  }
  
  return code;
}