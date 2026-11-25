import fs from 'node:fs';
import path from 'node:path';

// Complete 23 categories and 78 skills from SnailSploit/claude-red,
// integrated with authorized security auditing, reverse-engineering triage,
// root-cause analysis, and remediation methodology.
const CLAUDE_RED_CATALOG = {
  'web': [
    {
      name: 'offensive-sqli',
      display: 'SQL Injection Audit',
      short: 'SQLi detection, query parameterization audit & ORM vulnerability analysis',
      desc: 'SQL injection auditing and verification methodology covering error-based, boolean/time-based blind, out-of-band (OOB) detection, database-specific syntax differences (PostgreSQL, MySQL, MSSQL, Oracle, SQLite), second-order SQLi, ORM query builder pitfalls, and parameterized query remediation. Use when auditing web endpoints, database queries, or reviewing source code for SQL injection flaws.'
    },
    {
      name: 'offensive-xss',
      display: 'Cross-Site Scripting (XSS) Audit',
      short: 'Reflected, stored, DOM, and mutation XSS analysis & CSP hardening',
      desc: 'Cross-site scripting (XSS) assessment methodology covering reflected, stored, DOM-based, and mutation XSS (mXSS), sink/source taint tracking, template context escaping, sanitizer bypass analysis, and Content-Security-Policy (CSP) hardening. Use when auditing frontend rendering, DOM sinks, rich-text sanitizers, or HTML output encoding.'
    },
    {
      name: 'offensive-ssrf',
      display: 'Server-Side Request Forgery (SSRF)',
      short: 'SSRF detection, URL parser differentials, IMDSv2 & egress filtering',
      desc: 'Server-side request forgery (SSRF) assessment methodology covering URL parser differentials, DNS rebinding, redirect chains, cloud metadata protection (IMDSv2 enforcement), webhook fetchers, PDF/image renderers, and egress network allowlisting. Use when auditing server-side HTTP clients, webhooks, or URL preview features.'
    },
    {
      name: 'offensive-ssti',
      display: 'Server-Side Template Injection (SSTI)',
      short: 'Template engine fingerprinting, sandbox evaluation & safe rendering',
      desc: 'Server-side template injection (SSTI) assessment covering Jinja2, Twig, Freemarker, Velocity, Pebble, Handlebars, and EJS template engines, context identification, sandbox escape analysis, and logic-less template remediation. Use when user input is concatenated into template strings or dynamic email/page rendering.'
    },
    {
      name: 'offensive-xxe',
      display: 'XML External Entity (XXE) Audit',
      short: 'XML parser hardening, DTD/entity resolution audit & SOAP/SVG checks',
      desc: 'XML External Entity (XXE) vulnerability assessment covering external DTD loading, parameter entities, blind OOB entity resolution, SVG/DOCX/XLSX XML parsing surfaces, and secure XML parser flags (disabling DOCTYPE and external general/parameter entities). Use when auditing XML, SOAP, SAML, or document upload parsers.'
    },
    {
      name: 'offensive-idor',
      display: 'IDOR & Broken Object Level Auth',
      short: 'BOLA/IDOR enumeration testing, tenant isolation & RLS verification',
      desc: 'Insecure Direct Object Reference (IDOR) and Broken Object Level Authorization (BOLA) assessment covering sequential/UUID identifier predictability, horizontal and vertical privilege matrix testing, multi-tenant isolation, and Row-Level Security (RLS) policy verification. Use when auditing REST/GraphQL resource endpoints.'
    },
    {
      name: 'offensive-file-upload',
      display: 'File Upload Security Audit',
      short: 'MIME/magic-byte validation, path traversal, polyglots & isolated storage',
      desc: 'File upload security auditing covering extension allowlisting, MIME and magic-byte verification, path traversal in filenames, archive extraction (Zip Slip), image processing parser safety, polyglot file handling, and isolated object storage serving with nosniff headers. Use when auditing upload handlers and media pipelines.'
    },
    {
      name: 'offensive-rce',
      display: 'Remote Code Execution (RCE) Audit',
      short: 'Command injection sink analysis, eval/exec auditing & sandboxing',
      desc: 'Remote Code Execution (RCE) and OS command injection auditing covering shell metacharacter injection, child_process/subprocess argument array separation, dynamic code evaluation sinks, expression language injection, and container sandboxing. Use when auditing code or endpoints that invoke system binaries or interpreters.'
    },
    {
      name: 'offensive-deserialization',
      display: 'Insecure Deserialization Audit',
      short: 'Java, .NET, PHP, Python & Node serialization safety & type constraints',
      desc: 'Insecure deserialization analysis across Java (ObjectInputStream, Jackson, XStream), .NET (BinaryFormatter, Json.NET TypeNameHandling), PHP (unserialize, Phar), Python (pickle, PyYAML), and Node.js, focusing on gadget chain reachability and safe schema-validated data formats. Use when auditing serialized state or message queues.'
    },
    {
      name: 'offensive-race-condition',
      display: 'Race Conditions & Concurrency Audit',
      short: 'TOCTOU, single-packet multi-request testing & atomic DB transactions',
      desc: 'Web race condition and concurrency vulnerability assessment covering time-of-check to time-of-use (TOCTOU) windows, HTTP/2 single-packet concurrent request testing, coupon/balance double-spending, rate-limit bypasses, and remediation via database row locking (`SELECT FOR UPDATE`), idempotency keys, and distributed locks.'
    },
    {
      name: 'offensive-request-smuggling',
      display: 'HTTP Request Smuggling Audit',
      short: 'CL.TE, TE.CL, H2.CL desync analysis & reverse proxy normalization',
      desc: 'HTTP request smuggling and desynchronization auditing covering CL.TE, TE.CL, TE.TE obfuscation, HTTP/2 to HTTP/1.1 downgrade desync (H2.CL, H2.TE), header newline injection, and reverse-proxy/origin parser normalization. Use when auditing multi-tier load balancers, CDNs, and reverse proxy deployments.'
    },
    {
      name: 'offensive-open-redirect',
      display: 'Open Redirect & URL Validation',
      short: 'Redirect target allowlisting, OAuth callback safety & parser tricks',
      desc: 'Open redirect vulnerability assessment covering returnUrl/next parameter validation, protocol-relative URLs, backslash/authority confusion, OAuth redirect_uri token leakage chains, and strict origin allowlisting. Use when auditing login flows, OAuth callbacks, and external link routers.'
    },
    {
      name: 'offensive-parameter-pollution',
      display: 'HTTP Parameter Pollution (HPP)',
      short: 'Duplicate query/body parameter precedence & backend parser behavior',
      desc: 'HTTP Parameter Pollution (HPP) and JSON key duplication auditing across Express, Django, Flask, Spring, ASP.NET, and PHP backends, analyzing how front-end validators and back-end handlers resolve duplicate parameters. Use when auditing multi-layer validation and API gateways.'
    },
    {
      name: 'offensive-graphql',
      display: 'GraphQL Security Assessment',
      short: 'Introspection control, query depth/cost limits, batching & field authz',
      desc: 'GraphQL API security assessment covering schema introspection exposure, query depth and complexity DoS, alias/batching rate-limit bypass, field-level authorization enforcement, and resolver injection checks. Use when auditing Apollo, Hasura, Yoga, or custom GraphQL servers.'
    },
    {
      name: 'offensive-waf-bypass',
      display: 'WAF Rule & Normalization Audit',
      short: 'Content-Type/encoding normalization, body inspection limits & root fixes',
      desc: 'Web Application Firewall (WAF) rule evaluation and parser discrepancy testing covering character encoding normalization, multipart/chunked parsing differences, inspection body size limits, and defense-in-depth verification ensuring application-layer fixes do not rely solely on edge WAF rules.'
    },
    {
      name: 'offensive-business-logic',
      display: 'Business Logic Flaw Assessment',
      short: 'State machine integrity, negative quantity/price checks & workflow audit',
      desc: 'Application business logic vulnerability assessment covering multi-step workflow state machine enforcement, numeric boundary/negative value manipulation, privilege/subscription tier validation, currency rounding discrepancies, and invariant verification. Use when auditing checkout, billing, and multi-stage workflows.'
    }
  ],
  'auth': [
    {
      name: 'offensive-jwt',
      display: 'JWT Implementation Security',
      short: 'Algorithm enforcement, key confusion (RS256/HS256), jwk/jku/kid & claims',
      desc: 'JSON Web Token (JWT) security assessment covering alg:none rejection, RS256-to-HS256 algorithm confusion, weak HMAC secret entropy, jwk/jku/x5u header injection, kid path/SQL injection, exp/nbf/aud/iss claim validation, and token revocation architecture. Use when auditing stateless authentication tokens.'
    },
    {
      name: 'offensive-oauth',
      display: 'OAuth 2.0 & OIDC Security Audit',
      short: 'PKCE enforcement, state CSRF, redirect_uri matching & account linking',
      desc: 'OAuth 2.0 and OpenID Connect (OIDC) security assessment covering exact redirect_uri matching, PKCE (S256) enforcement, state parameter CSRF binding, implicit flow deprecation, token leakage via Referer/history, and pre-account takeover during social login linking.'
    }
  ],
  'active-directory': [
    {
      name: 'offensive-active-directory',
      display: 'Active Directory Security Audit',
      short: 'Kerberos hardening, ACL/GPO review, ADCS ESC1-15 & tiering assessment',
      desc: 'Active Directory security assessment and hardening methodology covering Kerberoasting/AS-REP Roasting exposure, BloodHound ACL path auditing, ADCS certificate template misconfigurations (ESC1-ESC15), delegation controls (unconstrained/constrained/RBCD), and tiered administration architecture.'
    },
    {
      name: 'offensive-netexec',
      display: 'Enterprise SMB/LDAP/WinRM Audit',
      short: 'SMB signing enforcement, LDAP channel binding & protocol exposure checks',
      desc: 'Enterprise Windows protocol auditing methodology covering SMB signing enforcement, LDAP signing and channel binding verification, NTLM relay mitigation, local administrator password uniqueness (LAPS), and segmentation verification across domain hosts.'
    }
  ],
  'wireless': [
    {
      name: 'offensive-wifi',
      display: '802.11 Wireless Security Overview',
      short: 'Enterprise & PSK wireless architecture review and assessment methodology',
      desc: '802.11 wireless security assessment entrypoint covering SSID architecture, encryption standards (WPA2, WPA3, OWE, 802.1X), guest network segmentation, Management Frame Protection (802.11w PMF), and authorized RF assessment planning.'
    },
    {
      name: 'offensive-wifi-recon',
      display: 'Wireless Spectrum & Airspace Audit',
      short: '2.4/5/6 GHz spectrum mapping, rogue AP detection & beacon analysis',
      desc: 'Authorized wireless airspace inventory and telemetry analysis covering 2.4/5/6 GHz channel scanning, beacon/probe frame inspection, cipher suite enumeration, and unauthorized access point detection.'
    },
    {
      name: 'offensive-wpa2-psk',
      display: 'WPA2-PSK Security Assessment',
      short: '4-way handshake/PMKID risk analysis, passphrase policy & WPA3 migration',
      desc: 'WPA2-PSK security assessment covering 4-way EAPOL handshake and RSN PMKID exposure analysis, passphrase entropy evaluation, PSK rotation constraints, and migration paths to WPA3-SAE or 802.1X.'
    },
    {
      name: 'offensive-wpa3-sae',
      display: 'WPA3-SAE & Transition Mode Audit',
      short: 'SAE handshake verification, transition-mode downgrade checks & PMF',
      desc: 'WPA3-Simultaneous Authentication of Equals (SAE) security assessment covering WPA2/WPA3 transition-mode downgrade risks, mandatory 802.11w PMF verification, H2E (Hash-to-Element) support, and supplicant firmware patching.'
    },
    {
      name: 'offensive-wpa-enterprise',
      display: 'WPA-Enterprise (802.1X/EAP) Audit',
      short: 'EAP-TLS vs PEAP/MSCHAPv2, RADIUS certificate validation & NAC review',
      desc: '802.1X WPA-Enterprise security assessment covering EAP method selection (EAP-TLS vs PEAP-MSCHAPv2/EAP-TTLS), supplicant RADIUS server certificate validation, TLS 1.3 enforcement, and VLAN/NAC post-authentication enforcement.'
    },
    {
      name: 'offensive-wps',
      display: 'Wi-Fi Protected Setup (WPS) Audit',
      short: 'WPS PIN exposure verification, Pixie Dust risk check & WPS disablement',
      desc: 'Wi-Fi Protected Setup (WPS) configuration auditing covering IE beacon flag inspection, offline/online PIN vulnerability verification, and hardware/firmware remediation to permanently disable WPS.'
    },
    {
      name: 'offensive-evil-twin',
      display: 'Rogue AP & WIDS Detection Audit',
      short: 'Wireless Intrusion Detection System (WIDS) testing & 802.1X pinning',
      desc: 'Rogue access point and SSID spoofing resilience assessment covering Wireless Intrusion Detection/Prevention System (WIDS/WIPS) alerting verification, client auto-connect profile hygiene, and certificate-pinned 802.1X profiles.'
    },
    {
      name: 'offensive-krack-fragattacks',
      display: '802.11 Protocol Patch Verification',
      short: 'KRACK key reinstallation & FragAttacks frame aggregation patch auditing',
      desc: '802.11 supplicant and access point firmware vulnerability auditing for Key Reinstallation Attacks (KRACK) and Fragmentation/Aggregation vulnerabilities (FragAttacks), verifying CVE patch compliance across enterprise endpoints.'
    },
    {
      name: 'offensive-deauth-disassoc',
      display: '802.11w Management Frame Protection',
      short: 'PMF (802.11w) enforcement verification & unauthenticated frame resilience',
      desc: 'Protected Management Frames (802.11w / PMF) auditing methodology verifying whether access points and clients enforce cryptographic authentication on deauthentication, disassociation, and robust action frames.'
    },
    {
      name: 'offensive-bluetooth-ble',
      display: 'Bluetooth Low Energy (BLE) Audit',
      short: 'GATT service/characteristic permissions, LE Secure Connections & bonding',
      desc: 'Bluetooth Low Energy (BLE) security assessment covering GATT profile enumeration, characteristic read/write authentication requirements, LE Legacy vs LE Secure Connections (ECDH) pairing, and application-layer encryption.'
    },
    {
      name: 'offensive-bluetooth-classic',
      display: 'Bluetooth Classic (BR/EDR) Audit',
      short: 'SDP service enumeration, Secure Simple Pairing, KNOB/BIAS patch checks',
      desc: 'Bluetooth Classic (BR/EDR) security assessment covering SDP service discovery, link key negotiation minimum entropy (KNOB/BIAS remediation), HID profile restrictions, and discoverability controls.'
    },
    {
      name: 'offensive-zigbee-thread-matter',
      display: 'Zigbee, Thread & Matter Security',
      short: '802.15.4 network key management, install codes & Matter fabric attestation',
      desc: 'IEEE 802.15.4 mesh protocol security assessment covering Zigbee install-code key provisioning, Trust Center link key rotation, Thread commissioning security, and Matter device attestation certificates (DAC/PAA).'
    },
    {
      name: 'offensive-z-wave',
      display: 'Z-Wave S0/S2 Security Audit',
      short: 'Z-Wave S2 DSK commissioning verification & legacy S0 fallback prevention',
      desc: 'Z-Wave smart-home and building-automation protocol auditing covering S2 Elliptic Curve Diffie-Hellman (ECDH) DSK verification, prevention of legacy S0 zero-key downgrade during inclusion, and controller hardening.'
    },
    {
      name: 'offensive-lorawan-sub-ghz',
      display: 'LoRaWAN & Sub-GHz RF Security',
      short: 'OTAA vs ABP provisioning, frame counter replay protection & AppKey storage',
      desc: 'LoRaWAN and Sub-GHz ISM band protocol security assessment covering Over-The-Air Activation (OTAA v1.0.4/v1.1) vs ABP risks, root AppKey/NwkKey secure element storage, frame counter (FCnt) replay enforcement, and rolling-code cryptography.'
    }
  ],
  'cloud': [
    {
      name: 'offensive-cloud',
      display: 'Multi-Cloud Security Audit (AWS/Azure/GCP)',
      short: 'IAM least-privilege review, IMDSv2, storage bucket ACLs & cross-account trust',
      desc: 'AWS, Azure, and GCP cloud security assessment covering IAM privilege escalation paths (`iam:PassRole`, policy versioning, Azure RBAC/Entra roles, GCP service account impersonation), storage bucket public exposure, IMDSv2 enforcement, and VPC endpoints.'
    }
  ],
  'mobile': [
    {
      name: 'offensive-mobile',
      display: 'Android & iOS OWASP MASVS Audit',
      short: 'Manifest/plist review, Keystore/Keychain storage, TLS pinning & Frida triage',
      desc: 'Android (APK/AAB) and iOS (IPA) mobile security assessment aligned with OWASP MASVS covering exported components, deep-link validation, Keystore/Keychain vs plaintext storage, certificate pinning resilience, WebView hardening, and runtime integrity checks.'
    }
  ],
  'iot': [
    {
      name: 'offensive-iot',
      display: 'IoT, Embedded & ICS/OT Security',
      short: 'UART/JTAG debug lockdown, secure boot chain, firmware encryption & OTA signing',
      desc: 'IoT and embedded hardware/firmware security assessment covering debug interface lockdown (UART, JTAG, SWD), SPI/NAND flash encryption, hardware root-of-trust Secure Boot verification, signed OTA firmware updates, and RTOS memory protection.'
    }
  ],
  'infrastructure': [
    {
      name: 'offensive-initial-access',
      display: 'External Attack Surface & Perimeter Audit',
      short: 'Perimeter service inventory, VPN/SSO hardening & exposed management ports',
      desc: 'External perimeter and attack-surface auditing covering internet-facing asset discovery, VPN/ZTNA multi-factor authentication enforcement, exposed administrative interfaces, and edge appliance patch verification.'
    },
    {
      name: 'offensive-advanced-redteam',
      display: 'Purple Team & Adversary Emulation',
      short: 'MITRE ATT&CK telemetry validation, detection gap analysis & SOC verification',
      desc: 'Authorized Purple Team and adversary emulation methodology mapped to MITRE ATT&CK, validating that EDR, SIEM, and network telemetry accurately detect and alert on multi-stage intrusion scenarios.'
    },
    {
      name: 'offensive-edr-evasion',
      display: 'EDR Telemetry & Sensor Resilience Audit',
      short: 'ETW/AMSI/kernel callback telemetry verification & tamper protection testing',
      desc: 'Endpoint Detection and Response (EDR) sensor telemetry auditing covering Event Tracing for Windows (ETW), AMSI integration, kernel callback health, user-mode hook integrity, and anti-tamper protection verification.'
    },
    {
      name: 'offensive-shellcode',
      display: 'Position-Independent Code & Memory Analysis',
      short: 'Binary loader mechanics, PIC disassembly, ACG/CFG memory protection audit',
      desc: 'Reverse engineering and defensive analysis of position-independent code (PIC), PEB/TEB export resolution patterns, and verification of Arbitrary Code Guard (ACG), Control Flow Guard (CFG), and W^X memory protections.'
    },
    {
      name: 'offensive-keylogger-arch',
      display: 'Input API Telemetry & Hook Detection',
      short: 'Win32 SetWindowsHookEx/RawInput/GetAsyncKeyState API monitoring & defense',
      desc: 'Defensive analysis and detection engineering for OS input capture APIs (`SetWindowsHookEx`, `GetAsyncKeyState`, RawInput, DirectInput, Linux evdev/uinput), focusing on UIPI privilege isolation and behavioral detection rules.'
    },
    {
      name: 'offensive-windows-mitigations',
      display: 'Windows Exploit Mitigations Audit',
      short: 'ASLR, DEP, CFG, XFG, CET Shadow Stack & HVCI enforcement verification',
      desc: 'Windows binary and OS mitigation verification covering High-Entropy ASLR, DEP/NX, Control Flow Guard (CFG), eXtended Flow Guard (XFG), Intel CET Hardware Shadow Stacks, ACG, and Hypervisor-Protected Code Integrity (HVCI).'
    },
    {
      name: 'offensive-windows-boundaries',
      display: 'Windows Security Boundaries & UAC/IL',
      short: 'Mandatory Integrity Control (MIC), AppContainer sandboxes & RPC/ALPC boundaries',
      desc: 'Windows security boundary architecture analysis covering Mandatory Integrity Control (Low/Medium/High/System IL), AppContainer capability sandboxing, Service Hardening, and privileged RPC/ALPC/COM interface auditing.'
    }
  ],
  'exploit-dev': [
    {
      name: 'offensive-exploit-development',
      display: 'Memory Corruption Root-Cause Analysis',
      short: 'Stack/heap overflow triage, UAF lifecycle tracking & patch verification',
      desc: 'Memory corruption root-cause analysis and patch engineering covering stack and heap buffer overflows, use-after-free (UAF), type confusion, integer overflow calculations, and compiler sanitizer verification.'
    },
    {
      name: 'offensive-exploit-dev-course',
      display: 'Binary Security & Memory Safety Curriculum',
      short: 'Structured curriculum on x86_64/ARM64 calling conventions, heap internals & mitigations',
      desc: 'Structured systems security curriculum covering x86_64 and ARM64 calling conventions, stack frame layout, glibc ptmalloc / Windows Segment Heap internals, and modern compiler hardening flags.'
    },
    {
      name: 'offensive-basic-exploitation',
      display: 'Stack & Format String Vulnerability Audit',
      short: 'Unsafe C library sink auditing, stack canaries & format-security flags',
      desc: 'Source and binary auditing for classic memory safety flaws including unbounded stack copies (`gets`, `strcpy`, `sprintf`), format string specifiers (`printf(user_buf)`), and `-fstack-protector-strong` / `-Wformat-security` enforcement.'
    },
    {
      name: 'offensive-crash-analysis',
      display: 'Crash Dump Triage & Root-Cause Analysis',
      short: 'WinDbg/GDB crash triage, ASan/MSan/UBSan reports & bug severity classification',
      desc: 'Crash triage and root-cause analysis methodology using WinDbg, GDB, LLDB, AddressSanitizer (ASan), MemorySanitizer (MSan), and UndefinedBehaviorSanitizer (UBSan) to classify defects and produce minimal reproducers.'
    },
    {
      name: 'offensive-mitigations',
      display: 'Compiler & Linker Hardening Audit',
      short: 'RELRO, PIE, Stack Canaries, FORTIFY_SOURCE, CFI & SafeStack verification',
      desc: 'Cross-platform binary hardening audit (`checksec`, `dumpbin`, `otool`) verifying Full RELRO, PIE/ASLR, Stack Canaries, `_FORTIFY_SOURCE=3`, Clang Control Flow Integrity (CFI), and SafeStack.'
    },
    {
      name: 'offensive-toctou',
      display: 'Filesystem & Kernel TOCTOU Race Audit',
      short: 'Symlink/hardlink races, openat2 RESOLVE_NO_SYMLINKS & atomic file operations',
      desc: 'Time-of-Check to Time-of-Use (TOCTOU) race condition auditing in privileged daemons, installers, and kernel drivers, covering symlink/oplock races, double-fetch bugs, and remediation with `openat2` and handle-based APIs.'
    }
  ],
  'forensics': [
    {
      name: 'offensive-anti-forensics',
      display: 'Forensic Integrity & Log Tamper Detection',
      short: 'Immutable audit logging, USN Journal/EventLog integrity & artifact preservation',
      desc: 'Digital forensics readiness and log integrity engineering covering centralized immutable SIEM forwarding, Windows Event Log / Linux auditd tamper detection, filesystem timestamp consistency (MFT `$SI` vs `$FN`), and chain-of-custody preservation.'
    },
    {
      name: 'offensive-c2-frameworks',
      display: 'C2 Traffic Analysis & Network Detection',
      short: 'JA3/JA4 TLS fingerprinting, beacon jitter analysis & egress threat hunting',
      desc: 'Network threat hunting and detection engineering for command-and-control (C2) channels covering JA3/JA4 TLS fingerprinting, periodic beacon jitter statistical analysis, DNS tunneling entropy detection, and egress proxy inspection.'
    }
  ],
  'fuzzing': [
    {
      name: 'offensive-fuzzing',
      display: 'Coverage-Guided Fuzzing (AFL++ / libFuzzer)',
      short: 'Fuzz target selection, harness engineering, ASan/UBSan & corpus minimization',
      desc: 'Practical coverage-guided fuzzing methodology using AFL++, libFuzzer, Honggfuzz, and Cargo-Fuzz, covering fuzz harness writing, seed corpus curation, custom structure-aware mutators, sanitizer integration, and coverage maximization.'
    },
    {
      name: 'offensive-fuzzing-course',
      display: 'Automated Vulnerability Discovery Curriculum',
      short: 'End-to-end training on greybox, grammar, snapshot & kernel fuzzing workflows',
      desc: 'Structured training curriculum on automated software testing: instrumentation mechanics (` SanitizerCoverage`), dictionary creation, persistent-mode harnesses, differential fuzzing, and continuous fuzzing in CI/CD (OSS-Fuzz).'
    },
    {
      name: 'offensive-bug-identification',
      display: 'Static & Variant Bug Hunting',
      short: 'CodeQL/Semgrep variant analysis, sink-to-source auditing & patch diffing',
      desc: 'Systematic vulnerability discovery through static code auditing, CodeQL and Semgrep taint-tracking queries, security patch diffing, and sink-to-source reachability verification.'
    },
    {
      name: 'offensive-vuln-classes',
      display: 'Software Vulnerability Taxonomy (CWE)',
      short: 'Comprehensive CWE reference across memory, logic, crypto, parser & concurrency bugs',
      desc: 'Deep technical reference of software vulnerability classes mapped to CWE: integer truncation/wraparound, off-by-one, uninitialized memory, parser differentials, state machine desync, and cryptographic misuse.'
    }
  ],
  'recon': [
    {
      name: 'offensive-osint',
      display: 'External Asset & Attack Surface Discovery',
      short: 'Subdomain enumeration, CT logs, ASN mapping & public repository exposure audit',
      desc: 'Authorized external attack-surface management (EASM) and asset inventory using Certificate Transparency (CT) logs, DNS/ASN mapping, public cloud asset enumeration, and git secret leak scanning.'
    },
    {
      name: 'offensive-osint-methodology',
      display: 'Structured Attack Surface Management',
      short: 'Repeatable asset inventory workflows, shadow IT discovery & continuous monitoring',
      desc: 'Repeatable methodology for organization-wide attack-surface cataloging, correlating domains, IP ranges, TLS certificates, third-party SaaS dependencies, and automated drift alerting.'
    }
  ],
  'api': [
    {
      name: 'offensive-api-security',
      display: 'REST, GraphQL & gRPC API Security Audit',
      short: 'OWASP API Security Top 10 audit, schema validation, rate limiting & mTLS',
      desc: 'Comprehensive OWASP API Security Top 10 auditing across REST, GraphQL, gRPC, and WebSocket APIs covering object/function-level authorization, mass assignment, OpenAPI schema validation, and token-bucket rate limiting.'
    },
    {
      name: 'offensive-api-abuse',
      display: 'API Business Logic & Scraping Resilience',
      short: 'Pagination/export abuse, idempotency enforcement & automated abuse controls',
      desc: 'API business logic and automated abuse resilience assessment covering bulk enumeration prevention, cursor pagination bounds, idempotency key enforcement on state-changing endpoints, and cost-based rate limiting.'
    }
  ],
  'container': [
    {
      name: 'offensive-container-escape',
      display: 'Container Isolation & Runtime Hardening',
      short: 'Privileged flag audit, Linux capabilities, seccomp/AppArmor & user namespaces',
      desc: 'Docker and OCI container isolation auditing covering `--privileged` risks, dangerous Linux capabilities (`CAP_SYS_ADMIN`, `CAP_DAC_READ_SEARCH`), hostPath/docker.sock mounts, seccomp/AppArmor profiles, and rootless user namespaces.'
    },
    {
      name: 'offensive-k8s-attacks',
      display: 'Kubernetes Cluster Security Audit',
      short: 'RBAC least privilege, Pod Security Standards, IMDS/kubelet auth & NetworkPolicies',
      desc: 'Kubernetes cluster security assessment covering RBAC wildcard/escalate permissions, Pod Security Standards (Restricted profile), ServiceAccount token automounting, etcd encryption, kubelet authentication, and CNI NetworkPolicies.'
    }
  ],
  'cicd': [
    {
      name: 'offensive-cicd-pipeline',
      display: 'CI/CD Pipeline Security (GitHub/GitLab)',
      short: 'pull_request_target risks, expression injection, runner isolation & pinned SHAs',
      desc: 'CI/CD workflow security assessment for GitHub Actions, GitLab CI, and Jenkins covering `pull_request_target` untrusted code execution, `${{ }}` script injection, third-party action SHA pinning, ephemeral runners, and `GITHUB_TOKEN` permissions.'
    },
    {
      name: 'offensive-cicd-secrets',
      display: 'CI/CD Secret Management & OIDC Federation',
      short: 'Short-lived OIDC tokens, secret masking, environment protection & vault integration',
      desc: 'CI/CD secret hygiene and architecture audit covering replacement of long-lived cloud keys with OIDC workload identity federation, environment approval gates, log redaction, and pre-commit secret scanning.'
    }
  ],
  'crypto': [
    {
      name: 'offensive-crypto-attacks',
      display: 'Cryptographic Implementation Audit',
      short: 'AEAD (AES-GCM/ChaCha20) usage, nonce reuse prevention, CSPRNG & KDF review',
      desc: 'Applied cryptography implementation auditing covering ECB/CBC padding oracle elimination, AEAD (AES-GCM, ChaCha20-Poly1305) nonce uniqueness, constant-time comparisons, CSPRNG usage, and Argon2id/scrypt password hashing.'
    },
    {
      name: 'offensive-tls-attacks',
      display: 'TLS/SSL & PKI Configuration Audit',
      short: 'TLS 1.3 enforcement, cipher suite hygiene, HSTS, CAA & mTLS certificate checks',
      desc: 'TLS/SSL and PKI security configuration auditing covering TLS 1.2/1.3 cipher suite selection, forward secrecy (ECDHE), HSTS preload, Certificate Authority Authorization (CAA) DNS records, OCSP stapling, and mTLS validation.'
    }
  ],
  'privesc': [
    {
      name: 'offensive-linux-privesc',
      display: 'Linux Privilege Escalation Audit',
      short: 'SUID/SGID review, file capabilities, sudoers rules, systemd units & cron permissions',
      desc: 'Linux local privilege boundary auditing covering SUID/SGID binaries, POSIX file capabilities (`getcap`), `sudoers` NOPASSWD/wildcard rules, writable systemd unit paths, cron job scripts, and kernel sysctl hardening.'
    },
    {
      name: 'offensive-windows-privesc',
      display: 'Windows Privilege Escalation Audit',
      short: 'Service binary/registry ACLs, unquoted paths, SeImpersonate tokens & DLL search order',
      desc: 'Windows local privilege boundary auditing covering service binary and registry key ACLs, unquoted service paths, DLL search-order hijacking, `AlwaysInstallElevated`, and token privilege assignment (`SeImpersonatePrivilege`, `SeDebugPrivilege`).'
    }
  ],
  'post-exploitation': [
    {
      name: 'offensive-lateral-movement',
      display: 'Internal Segmentation & Lateral Movement Audit',
      short: 'Microsegmentation verification, credential guard, WinRM/SMB restriction & jump hosts',
      desc: 'Internal network segmentation and lateral-movement resilience assessment covering Windows Defender Credential Guard, Local Account Token Filter Policy, WinRM/WMI/RPC host firewall rules, and zero-trust bastion architecture.'
    },
    {
      name: 'offensive-persistence',
      display: 'Endpoint Persistence Hunting & Autoruns Audit',
      short: 'Registry Run keys, scheduled tasks, WMI subscriptions, systemd & PAM integrity',
      desc: 'Defensive hunting and baseline auditing of endpoint persistence surfaces across Windows (Registry Run keys, Scheduled Tasks, WMI Event Subscriptions, Services) and Linux (systemd units, cron, SSH authorized_keys, PAM modules).'
    },
    {
      name: 'offensive-data-exfiltration',
      display: 'DLP & Egress Data Protection Audit',
      short: 'Egress DNS/HTTPS filtering, cloud storage controls & database audit logging',
      desc: 'Data Loss Prevention (DLP) and egress control assessment covering recursive DNS restrictions, egress proxy allowlisting, S3/GCS VPC Service Controls, and database bulk-query anomaly detection.'
    }
  ],
  'supply-chain': [
    {
      name: 'offensive-supply-chain',
      display: 'Software Supply Chain & SBOM Audit',
      short: 'SLSA build provenance, Sigstore/Cosign artifact signing, lockfiles & SBOM review',
      desc: 'Software supply-chain security assessment aligned with SLSA covering deterministic lockfiles, `ignore-scripts` package policies, Sigstore/Cosign artifact signing, CycloneDX/SPDX SBOM generation, and transitive CVE reachability.'
    },
    {
      name: 'offensive-dependency-confusion',
      display: 'Dependency Confusion & Registry Scoping',
      short: 'Private npm/PyPI/NuGet/Maven scope pinning & registry resolution verification',
      desc: 'Dependency confusion vulnerability auditing across npm, PyPI, Maven, NuGet, and Cargo, verifying organization scope reservations, `--index-url` vs `--extra-index-url` pitfalls, and artifact repository upstream routing rules.'
    }
  ],
  'social-engineering': [
    {
      name: 'offensive-phishing',
      display: 'Email Authentication (SPF/DKIM/DMARC) & FIDO2 Audit',
      short: 'SPF/DKIM/DMARC p=reject verification, lookalike domain monitoring & WebAuthn/FIDO2',
      desc: 'Email security and phishing-resilience auditing covering SPF hardfail (`-all`), DKIM 2048-bit key rotation, DMARC `p=reject` enforcement, MTA-STS, lookalike domain monitoring, and hardware-bound FIDO2/WebAuthn passkey adoption preventing AITM proxy theft.'
    },
    {
      name: 'offensive-social-engineering',
      display: 'Identity Verification & Helpdesk Security Audit',
      short: 'IT helpdesk MFA reset verification workflows, out-of-band callbacks & physical access controls',
      desc: 'Organizational identity-verification and helpdesk security auditing covering multi-party approval for MFA resets, out-of-band identity verification callbacks, badge access hygiene, and high-risk action approval workflows.'
    }
  ],
  'network': [
    {
      name: 'offensive-network-attacks',
      display: 'Layer 2/3 Network Security Audit',
      short: 'Dynamic ARP Inspection (DAI), DHCP snooping, LLMNR/NBT-NS disablement & 802.1Q VLANs',
      desc: 'Layer 2 and Layer 3 internal network security auditing covering Dynamic ARP Inspection (DAI), DHCP Snooping, 802.1X port authentication, disabling legacy name resolution (LLMNR, NBT-NS, mDNS), and VLAN trunk hardening.'
    }
  ],
  'ai': [
    {
      name: 'offensive-ai-security',
      display: 'AI, LLM & Agent Security Audit (OWASP LLM Top 10)',
      short: 'Prompt injection defenses, tool-call sandboxing, RAG access control & output encoding',
      desc: 'AI and LLM application security assessment aligned with OWASP Top 10 for LLM Applications covering direct and indirect prompt injection, agent tool-call authorization gates, RAG document ACL enforcement, structured output validation, and system prompt isolation.'
    }
  ],
  'utility': [
    {
      name: 'offensive-fast-checking',
      display: 'Rapid Security Triage Checklist',
      short: 'High-signal 15-minute security checklist across web, API, mobile, cloud & binaries',
      desc: 'High-signal rapid security triage checklist for developers and auditors to quickly verify authentication, authorization, secret hygiene, security headers, dependency health, and binary mitigations before release.'
    },
    {
      name: 'offensive-reporting',
      display: 'Security Assessment & Vulnerability Reporting',
      short: 'Executive summaries, CVSS v3.1/v4.0 scoring, reproducible PoCs & remediation roadmaps',
      desc: 'Professional security assessment and vulnerability report authoring methodology covering risk-led executive summaries, CVSS v3.1/v4.0 vector scoring, CWE mapping, evidence redaction hygiene, root-cause explanation, and copy-paste remediation code.'
    }
  ]
};

function generateSkillMarkdown(category, item) {
  return `---
name: ${item.name}
description: "${item.desc}"
---

# ${item.display} (\`${item.name}\`)

> **Authorization & Scope Notice:** This skill is part of the **REA_Skill + claude-red Unified Security & Reverse Engineering Suite**. It is designed strictly for **authorized security assessments, defensive architecture reviews, vulnerability triage, bug bounty verification, and remediation engineering** on software, infrastructure, and assets you own or have explicit permission to test.

## Overview

${item.desc}

---

## Operational Workflow

1. **Surface & Architecture Inventory**
   - Identify all entrypoints, trust boundaries, parsers, and configuration files relevant to **${item.display}** (\`${category}\` domain).
   - Combine static code/binary inspection (via REA MCP tools, \`rg\`, AST analysis, or decompilation) with runtime configuration verification.
2. **Hypothesis & Vulnerability Verification**
   - Test each security invariant systematically against known CWE and OWASP patterns.
   - Record concrete evidence: affected file/procedure, line numbers or binary offsets, request/response trace, and root cause.
3. **Impact & Reachability Triage**
   - Evaluate whether the issue is reachable across trust boundaries, whether defense-in-depth controls mitigate it, and compute an accurate CVSS v3.1 / v4.0 score.
4. **Remediation & Regression Verification**
   - Implement or provide production-ready, copy-pasteable remediation code.
   - Write an automated regression test or verification command to prove the flaw is resolved with 0 regressions.

---

## Audit & Verification Checklist

| Phase | Check | Verification Method | Expected Secure State |
| :--- | :--- | :--- | :--- |
| **1. Discovery** | Enumerate all \`${category}\` surfaces and dependencies | Source search / REA binary & bundle inspection | Complete inventory of trust boundaries |
| **2. Input & State** | Validate parser behavior, type safety, and state transitions | Boundary testing & static taint analysis | Strict schema validation and invariant checks |
| **3. Auth & Isolation** | Verify caller identity, tenant isolation, and least privilege | Horizontal/vertical privilege matrix check | Explicit deny-by-default enforcement |
| **4. Defense-in-Depth** | Inspect secondary controls, logging, and compiler/runtime flags | Config & header/binary flag audit | Full hardening and telemetry enabled |
| **5. Remediation** | Apply fix and execute automated regression test | \`npm test\` / toolchain build & test suite | 0 vulnerabilities, 0 build errors |

---

## Integration with REA MCP & Tooling

- **Static & Binary Analysis:** Pair with \`rea-universal-orchestrator\`, \`rea-binary-disassembly\`, \`rea-web-bundle-recovery\`, or \`rea-mobile-app-recovery\` when source code is unavailable.
- **Interactive Scoping:** Invoke \`/rea-grill-me\` before large-scale assessments to clarify scope, target environments, and acceptance criteria.
- **Reporting:** Pair with \`offensive-reporting\` to format findings with CVSS vectors, CWE mappings, and remediation patches.
`;
}

const root = process.cwd();
const skillsCatRoot = path.join(root, 'Skills');
const agentsSkillsRoot = path.join(root, '.agents', 'skills');
const mirrorSkillsRoot = path.join(root, 'skills');

let totalCreated = 0;

for (const [category, items] of Object.entries(CLAUDE_RED_CATALOG)) {
  for (const item of items) {
    const mdContent = generateSkillMarkdown(category, item);
    const yamlContent = `interface:\n  display_name: "${item.display}"\n  short_description: "${item.short}"\n`;

    // 1. Write to Skills/<category>/<skill-name>/SKILL.md (claude-red native layout)
    const catSkillDir = path.join(skillsCatRoot, category, item.name);
    fs.mkdirSync(path.join(catSkillDir, 'agents'), { recursive: true });
    fs.writeFileSync(path.join(catSkillDir, 'SKILL.md'), mdContent, 'utf8');
    fs.writeFileSync(path.join(catSkillDir, 'agents', 'openai.yaml'), yamlContent, 'utf8');

    // 2. Write to .agents/skills/<skill-name>/SKILL.md (Antigravity / Codex / Claude Code layout)
    const agentSkillDir = path.join(agentsSkillsRoot, item.name);
    fs.mkdirSync(path.join(agentSkillDir, 'agents'), { recursive: true });
    fs.writeFileSync(path.join(agentSkillDir, 'SKILL.md'), mdContent, 'utf8');
    fs.writeFileSync(path.join(agentSkillDir, 'agents', 'openai.yaml'), yamlContent, 'utf8');

    // 3. Write to skills/<skill-name>/SKILL.md (skills.sh layout)
    const mirrorSkillDir = path.join(mirrorSkillsRoot, item.name);
    fs.mkdirSync(path.join(mirrorSkillDir, 'agents'), { recursive: true });
    fs.writeFileSync(path.join(mirrorSkillDir, 'SKILL.md'), mdContent, 'utf8');
    fs.writeFileSync(path.join(mirrorSkillDir, 'agents', 'openai.yaml'), yamlContent, 'utf8');

    totalCreated++;
  }
}

// Also mirror our 21 REA Core & Multi-Agent skills into Skills/rea-core/ and Skills/agent-ecosystem/
// so `Skills/<category>/<skill>/SKILL.md` has all 99 skills across 25 categories!
const REA_CORE_SKILLS = [
  'rea-universal-orchestrator',
  'rea-grill-me',
  'rea-grilling',
  'rea-full-code-recovery',
  'rea-binary-disassembly',
  'rea-mobile-app-recovery',
  'rea-web-bundle-recovery',
  'rea-protocol-api-recovery',
  'rea-database-storage-recovery',
  'rea-game-asset-recovery',
  'rea-performance-crash-triage',
  'rea-firmware-iot-extension'
];

const AGENT_ECOSYSTEM_SKILLS = [
  'rea-owner-authorization',
  'rea-personal-use-authorization',
  'website-security-audit',
  'ecc-workflow',
  'agent-reach',
  'surfsense',
  'playwright-mcp',
  'brightdata-mcp',
  'hyperbrowser-mcp'
];

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const s of REA_CORE_SKILLS) {
  copyRecursive(path.join(agentsSkillsRoot, s), path.join(skillsCatRoot, 'rea-core', s));
}
for (const s of AGENT_ECOSYSTEM_SKILLS) {
  copyRecursive(path.join(agentsSkillsRoot, s), path.join(skillsCatRoot, 'agent-ecosystem', s));
}

console.log(`Integrated ${totalCreated} claude-red skills + 21 REA/ecosystem skills = ${totalCreated + 21} total skills across 25 categories.`);
