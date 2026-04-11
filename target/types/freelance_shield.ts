/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/freelance_shield.json`.
 */
export type FreelanceShield = {
  "address": "eUdRS4cqv3emMFX7Ymhg4NDNWKkPQZLyzB8uVki1C27",
  "metadata": {
    "name": "freelanceShield",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Milestone-based escrow for freelancers on Solana"
  },
  "instructions": [
    {
      "name": "acceptContract",
      "discriminator": [
        217,
        254,
        164,
        16,
        244,
        59,
        30,
        81
      ],
      "accounts": [
        {
          "name": "freelancer",
          "signer": true
        },
        {
          "name": "contract",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "approveMilestone",
      "discriminator": [
        145,
        85,
        92,
        60,
        50,
        130,
        219,
        106
      ],
      "accounts": [
        {
          "name": "client",
          "signer": true,
          "relations": [
            "contract"
          ]
        },
        {
          "name": "contract"
        },
        {
          "name": "milestone",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "autoRelease",
      "discriminator": [
        212,
        34,
        30,
        246,
        192,
        13,
        97,
        31
      ],
      "accounts": [
        {
          "name": "cranker",
          "docs": [
            "Anyone can crank this -- permissionless"
          ],
          "signer": true
        },
        {
          "name": "contract"
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "freelancerTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "createContract",
      "discriminator": [
        244,
        48,
        244,
        178,
        216,
        88,
        122,
        52
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true
        },
        {
          "name": "contract",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  116,
                  114,
                  97,
                  99,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "client"
              },
              {
                "kind": "arg",
                "path": "contractId"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "contractId",
          "type": "u64"
        },
        {
          "name": "autoReleaseHours",
          "type": "u64"
        },
        {
          "name": "milestones",
          "type": {
            "vec": {
              "defined": {
                "name": "milestoneInput"
              }
            }
          }
        }
      ]
    },
    {
      "name": "fundMilestone",
      "discriminator": [
        104,
        130,
        72,
        76,
        84,
        58,
        37,
        181
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true,
          "relations": [
            "contract"
          ]
        },
        {
          "name": "contract"
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "clientTokenAccount",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initMilestone",
      "discriminator": [
        185,
        80,
        114,
        238,
        109,
        204,
        12,
        130
      ],
      "accounts": [
        {
          "name": "client",
          "writable": true,
          "signer": true,
          "relations": [
            "contract"
          ]
        },
        {
          "name": "contract",
          "writable": true
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "usdcMint"
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "index",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initTrustScore",
      "discriminator": [
        91,
        154,
        203,
        17,
        61,
        168,
        88,
        136
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "trustScore",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  117,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "raiseDispute",
      "discriminator": [
        41,
        243,
        1,
        51,
        150,
        95,
        246,
        73
      ],
      "accounts": [
        {
          "name": "raiser",
          "signer": true
        },
        {
          "name": "contract",
          "writable": true
        },
        {
          "name": "milestone",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "releaseMilestone",
      "discriminator": [
        56,
        2,
        199,
        164,
        184,
        108,
        167,
        222
      ],
      "accounts": [
        {
          "name": "client",
          "signer": true,
          "relations": [
            "contract"
          ]
        },
        {
          "name": "contract"
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "freelancerTokenAccount",
          "writable": true
        },
        {
          "name": "vaultAuthority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "resolveDispute",
      "discriminator": [
        231,
        6,
        202,
        6,
        96,
        103,
        12,
        230
      ],
      "accounts": [
        {
          "name": "client",
          "signer": true,
          "relations": [
            "contract"
          ]
        },
        {
          "name": "contract",
          "writable": true
        },
        {
          "name": "milestone",
          "writable": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "milestone"
              }
            ]
          }
        },
        {
          "name": "recipientTokenAccount",
          "docs": [
            "The recipient -- either client or freelancer depending on resolution"
          ],
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": [
        {
          "name": "releaseToFreelancer",
          "type": "bool"
        }
      ]
    },
    {
      "name": "submitMilestone",
      "discriminator": [
        35,
        96,
        220,
        215,
        102,
        83,
        139,
        52
      ],
      "accounts": [
        {
          "name": "freelancer",
          "signer": true
        },
        {
          "name": "contract"
        },
        {
          "name": "milestone",
          "writable": true
        }
      ],
      "args": []
    },
    {
      "name": "updateTrustOnRelease",
      "discriminator": [
        76,
        27,
        100,
        250,
        250,
        218,
        158,
        43
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true
        },
        {
          "name": "freelancerTrust",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  117,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "freelancer_trust.user",
                "account": "trustScore"
              }
            ]
          }
        },
        {
          "name": "clientTrust",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  117,
                  115,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "client_trust.user",
                "account": "trustScore"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "onTime",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "escrowContract",
      "discriminator": [
        217,
        21,
        73,
        45,
        210,
        127,
        211,
        81
      ]
    },
    {
      "name": "milestone",
      "discriminator": [
        38,
        210,
        239,
        177,
        85,
        184,
        10,
        44
      ]
    },
    {
      "name": "trustScore",
      "discriminator": [
        243,
        22,
        69,
        106,
        84,
        238,
        239,
        5
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorizedClient",
      "msg": "Only the client can perform this action"
    },
    {
      "code": 6001,
      "name": "unauthorizedFreelancer",
      "msg": "Only the freelancer can perform this action"
    },
    {
      "code": 6002,
      "name": "invalidContractStatus",
      "msg": "Contract is not in the expected status"
    },
    {
      "code": 6003,
      "name": "invalidMilestoneStatus",
      "msg": "Milestone is not in the expected status"
    },
    {
      "code": 6004,
      "name": "cannotAcceptOwnContract",
      "msg": "Cannot accept your own contract"
    },
    {
      "code": 6005,
      "name": "freelancerAlreadyAssigned",
      "msg": "Contract already has a freelancer assigned"
    },
    {
      "code": 6006,
      "name": "autoReleaseNotReady",
      "msg": "Auto-release time has not been reached yet"
    },
    {
      "code": 6007,
      "name": "notContractParty",
      "msg": "Only a contract party can raise a dispute"
    },
    {
      "code": 6008,
      "name": "amountMismatch",
      "msg": "Milestone amounts do not match contract total"
    },
    {
      "code": 6009,
      "name": "tooManyMilestones",
      "msg": "Too many milestones (max 10)"
    }
  ],
  "types": [
    {
      "name": "contractStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "draft"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          },
          {
            "name": "disputed"
          },
          {
            "name": "cancelled"
          }
        ]
      }
    },
    {
      "name": "escrowContract",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "client",
            "type": "pubkey"
          },
          {
            "name": "freelancer",
            "type": "pubkey"
          },
          {
            "name": "contractId",
            "type": "u64"
          },
          {
            "name": "milestoneCount",
            "type": "u8"
          },
          {
            "name": "totalAmount",
            "type": "u64"
          },
          {
            "name": "autoReleaseHours",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "contractStatus"
              }
            }
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "milestone",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "contract",
            "type": "pubkey"
          },
          {
            "name": "index",
            "type": "u8"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "milestoneStatus"
              }
            }
          },
          {
            "name": "fundedAt",
            "type": "i64"
          },
          {
            "name": "submittedAt",
            "type": "i64"
          },
          {
            "name": "approvedAt",
            "type": "i64"
          },
          {
            "name": "autoReleaseAt",
            "type": "i64"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "milestoneInput",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "milestoneStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "funded"
          },
          {
            "name": "submitted"
          },
          {
            "name": "approved"
          },
          {
            "name": "disputed"
          },
          {
            "name": "released"
          }
        ]
      }
    },
    {
      "name": "trustScore",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "contractsCompleted",
            "type": "u32"
          },
          {
            "name": "contractsFunded",
            "type": "u32"
          },
          {
            "name": "onTimeDeliveries",
            "type": "u32"
          },
          {
            "name": "totalDeliveries",
            "type": "u32"
          },
          {
            "name": "disputesRaised",
            "type": "u32"
          },
          {
            "name": "disputesLost",
            "type": "u32"
          },
          {
            "name": "totalPaid",
            "type": "u64"
          },
          {
            "name": "totalEarned",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
