export default {
  types: {
    string: [
      'pstring',
      {
        countType: 'varint',
      },
    ],
    ByteArray: [
      'buffer',
      {
        countType: 'varint',
      },
    ],
    SignedByteArray: [
      'buffer',
      {
        countType: 'zigzag32',
      },
    ],
    LittleString: [
      'pstring',
      {
        countType: 'li32',
      },
    ],
    LatinString: [
      'pstring',
      {
        countType: 'varint',
        encoding: 'latin1',
      },
    ],
    ShortArray: [
      'buffer',
      {
        countType: 'li16',
      },
    ],
    ShortString: [
      'pstring',
      {
        countType: 'li16',
      },
    ],
    varint64: 'native',
    zigzag32: 'native',
    zigzag64: 'native',
    uuid: 'native',
    byterot: 'native',
    bitflags: 'native',
    restBuffer: 'native',
    encapsulated: 'native',
    nbt: 'native',
    lnbt: 'native',
    nbtLoop: 'native',
    enum_size_based_on_values_len: 'native',
    MapInfo: 'native',
    TexturePackInfos: [
      'array',
      {
        countType: 'li16',
        type: [
          'container',
          [
            {
              name: 'uuid',
              type: 'uuid',
            },
            {
              name: 'version',
              type: 'string',
            },
            {
              name: 'size',
              type: 'lu64',
            },
            {
              name: 'content_key',
              type: 'string',
            },
            {
              name: 'sub_pack_name',
              type: 'string',
            },
            {
              name: 'content_identity',
              type: 'string',
            },
            {
              name: 'has_scripts',
              type: 'bool',
            },
            {
              name: 'addon_pack',
              type: 'bool',
            },
            {
              name: 'rtx_enabled',
              type: 'bool',
            },
            {
              name: 'cdn_url',
              type: 'string',
            },
          ],
        ],
      },
    ],
    ResourcePackIdVersions: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'uuid',
              type: 'string',
            },
            {
              name: 'version',
              type: 'string',
            },
            {
              name: 'name',
              type: 'string',
            },
          ],
        ],
      },
    ],
    ResourcePackIds: [
      'array',
      {
        countType: 'li16',
        type: 'string',
      },
    ],
    Experiment: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'enabled',
          type: 'bool',
        },
      ],
    ],
    Experiments: [
      'array',
      {
        countType: 'li32',
        type: 'Experiment',
      },
    ],
    GameMode: [
      'mapper',
      {
        type: 'zigzag32',
        mappings: {
          0: 'survival',
          1: 'creative',
          2: 'adventure',
          3: 'survival_spectator',
          4: 'creative_spectator',
          5: 'fallback',
          6: 'spectator',
        },
      },
    ],
    GameRule: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'editable',
          type: 'bool',
        },
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                1: 'bool',
                2: 'int',
                3: 'float',
              },
            },
          ],
        },
        {
          name: 'value',
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                bool: 'bool',
                int: 'zigzag32',
                float: 'lf32',
              },
            },
          ],
        },
      ],
    ],
    GameRules: [
      'array',
      {
        countType: 'varint',
        type: 'GameRule',
      },
    ],
    Blob: [
      'container',
      [
        {
          name: 'hash',
          type: 'lu64',
        },
        {
          name: 'payload',
          type: 'ByteArray',
        },
      ],
    ],
    BlockProperties: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'state',
              type: 'nbt',
            },
          ],
        ],
      },
    ],
    Itemstates: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'runtime_id',
              type: 'li16',
            },
            {
              name: 'component_based',
              type: 'bool',
            },
          ],
        ],
      },
    ],
    ItemExtraDataWithBlockingTick: [
      'container',
      [
        {
          name: 'has_nbt',
          type: [
            'mapper',
            {
              type: 'lu16',
              mappings: {
                0: 'false',
                65535: 'true',
              },
            },
          ],
        },
        {
          name: 'nbt',
          type: [
            'switch',
            {
              compareTo: 'has_nbt',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'version',
                      type: 'u8',
                    },
                    {
                      name: 'nbt',
                      type: 'lnbt',
                    },
                  ],
                ],
              },
              default: 'void',
            },
          ],
        },
        {
          name: 'can_place_on',
          type: [
            'array',
            {
              countType: 'li32',
              type: 'ShortString',
            },
          ],
        },
        {
          name: 'can_destroy',
          type: [
            'array',
            {
              countType: 'li32',
              type: 'ShortString',
            },
          ],
        },
        {
          name: 'blocking_tick',
          type: 'li64',
        },
      ],
    ],
    ItemExtraDataWithoutBlockingTick: [
      'container',
      [
        {
          name: 'has_nbt',
          type: [
            'mapper',
            {
              type: 'lu16',
              mappings: {
                0: 'false',
                65535: 'true',
              },
            },
          ],
        },
        {
          name: 'nbt',
          type: [
            'switch',
            {
              compareTo: 'has_nbt',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'version',
                      type: 'u8',
                    },
                    {
                      name: 'nbt',
                      type: 'lnbt',
                    },
                  ],
                ],
              },
              default: 'void',
            },
          ],
        },
        {
          name: 'can_place_on',
          type: [
            'array',
            {
              countType: 'li32',
              type: 'ShortString',
            },
          ],
        },
        {
          name: 'can_destroy',
          type: [
            'array',
            {
              countType: 'li32',
              type: 'ShortString',
            },
          ],
        },
      ],
    ],
    ItemLegacy: [
      'container',
      [
        {
          name: 'network_id',
          type: 'zigzag32',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'network_id',
              fields: {
                0: 'void',
              },
              default: [
                'container',
                [
                  {
                    name: 'count',
                    type: 'lu16',
                  },
                  {
                    name: 'metadata',
                    type: 'varint',
                  },
                  {
                    name: 'block_runtime_id',
                    type: 'zigzag32',
                  },
                  {
                    name: 'extra',
                    type: [
                      'switch',
                      {
                        compareTo: 'network_id',
                        fields: {
                          '/ShieldItemID': [
                            'encapsulated',
                            {
                              lengthType: 'varint',
                              type: 'ItemExtraDataWithBlockingTick',
                            },
                          ],
                        },
                        default: [
                          'encapsulated',
                          {
                            lengthType: 'varint',
                            type: 'ItemExtraDataWithoutBlockingTick',
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    Item: [
      'container',
      [
        {
          name: 'network_id',
          type: 'zigzag32',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'network_id',
              fields: {
                0: 'void',
              },
              default: [
                'container',
                [
                  {
                    name: 'count',
                    type: 'lu16',
                  },
                  {
                    name: 'metadata',
                    type: 'varint',
                  },
                  {
                    name: 'has_stack_id',
                    type: 'u8',
                  },
                  {
                    name: 'stack_id',
                    type: [
                      'switch',
                      {
                        compareTo: 'has_stack_id',
                        fields: {
                          0: 'void',
                        },
                        default: 'zigzag32',
                      },
                    ],
                  },
                  {
                    name: 'block_runtime_id',
                    type: 'zigzag32',
                  },
                  {
                    name: 'extra',
                    type: [
                      'switch',
                      {
                        compareTo: 'network_id',
                        fields: {
                          '/ShieldItemID': [
                            'encapsulated',
                            {
                              lengthType: 'varint',
                              type: 'ItemExtraDataWithBlockingTick',
                            },
                          ],
                        },
                        default: [
                          'encapsulated',
                          {
                            lengthType: 'varint',
                            type: 'ItemExtraDataWithoutBlockingTick',
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    vec3i: [
      'container',
      [
        {
          name: 'x',
          type: 'zigzag32',
        },
        {
          name: 'y',
          type: 'zigzag32',
        },
        {
          name: 'z',
          type: 'zigzag32',
        },
      ],
    ],
    vec3li: [
      'container',
      [
        {
          name: 'x',
          type: 'li32',
        },
        {
          name: 'y',
          type: 'li32',
        },
        {
          name: 'z',
          type: 'li32',
        },
      ],
    ],
    vec3u: [
      'container',
      [
        {
          name: 'x',
          type: 'varint',
        },
        {
          name: 'y',
          type: 'varint',
        },
        {
          name: 'z',
          type: 'varint',
        },
      ],
    ],
    vec3f: [
      'container',
      [
        {
          name: 'x',
          type: 'lf32',
        },
        {
          name: 'y',
          type: 'lf32',
        },
        {
          name: 'z',
          type: 'lf32',
        },
      ],
    ],
    vec2f: [
      'container',
      [
        {
          name: 'x',
          type: 'lf32',
        },
        {
          name: 'z',
          type: 'lf32',
        },
      ],
    ],
    Vec3fopts: [
      'container',
      [
        {
          name: 'x',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'y',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'z',
          type: [
            'option',
            'lf32',
          ],
        },
      ],
    ],
    Vec2fopts: [
      'container',
      [
        {
          name: 'x',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'y',
          type: [
            'option',
            'lf32',
          ],
        },
      ],
    ],
    MetadataDictionary: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'key',
              type: [
                'mapper',
                {
                  type: 'varint',
                  mappings: {
                    0: 'flags',
                    1: 'health',
                    2: 'variant',
                    3: 'color',
                    4: 'nametag',
                    5: 'owner_eid',
                    6: 'target_eid',
                    7: 'air',
                    8: 'potion_color',
                    9: 'potion_ambient',
                    10: 'jump_duration',
                    11: 'hurt_time',
                    12: 'hurt_direction',
                    13: 'paddle_time_left',
                    14: 'paddle_time_right',
                    15: 'experience_value',
                    16: 'minecart_display_block',
                    17: 'minecart_display_offset',
                    18: 'minecart_has_display',
                    20: 'old_swell',
                    21: 'swell_dir',
                    22: 'charge_amount',
                    23: 'enderman_held_runtime_id',
                    24: 'entity_age',
                    26: 'player_flags',
                    27: 'player_index',
                    28: 'player_bed_position',
                    29: 'fireball_power_x',
                    30: 'fireball_power_y',
                    31: 'fireball_power_z',
                    32: 'aux_power',
                    33: 'fish_x',
                    34: 'fish_z',
                    35: 'fish_angle',
                    36: 'potion_aux_value',
                    37: 'lead_holder_eid',
                    38: 'scale',
                    39: 'interactive_tag',
                    40: 'npc_skin_id',
                    41: 'url_tag',
                    42: 'max_airdata_max_air',
                    43: 'mark_variant',
                    44: 'container_type',
                    45: 'container_base_size',
                    46: 'container_extra_slots_per_strength',
                    47: 'block_target',
                    48: 'wither_invulnerable_ticks',
                    49: 'wither_target_1',
                    50: 'wither_target_2',
                    51: 'wither_target_3',
                    52: 'aerial_attack',
                    53: 'boundingbox_width',
                    54: 'boundingbox_height',
                    55: 'fuse_length',
                    56: 'rider_seat_position',
                    57: 'rider_rotation_locked',
                    58: 'rider_max_rotation',
                    59: 'rider_min_rotation',
                    60: 'rider_rotation_offset',
                    61: 'area_effect_cloud_radius',
                    62: 'area_effect_cloud_waiting',
                    63: 'area_effect_cloud_particle_id',
                    64: 'shulker_peek_id',
                    65: 'shulker_attach_face',
                    66: 'shulker_attached',
                    67: 'shulker_attach_pos',
                    68: 'trading_player_eid',
                    69: 'trading_career',
                    70: 'has_command_block',
                    71: 'command_block_command',
                    72: 'command_block_last_output',
                    73: 'command_block_track_output',
                    74: 'controlling_rider_seat_number',
                    75: 'strength',
                    76: 'max_strength',
                    77: 'spell_casting_color',
                    78: 'limited_life',
                    79: 'armor_stand_pose_index',
                    80: 'ender_crystal_time_offset',
                    81: 'always_show_nametag',
                    82: 'color_2',
                    83: 'name_author',
                    84: 'score_tag',
                    85: 'balloon_attached_entity',
                    86: 'pufferfish_size',
                    87: 'bubble_time',
                    88: 'agent',
                    89: 'sitting_amount',
                    90: 'sitting_amount_previous',
                    91: 'eating_counter',
                    92: 'flags_extended',
                    93: 'laying_amount',
                    94: 'laying_amount_previous',
                    95: 'duration',
                    96: 'spawn_time',
                    97: 'change_rate',
                    98: 'change_on_pickup',
                    99: 'pickup_count',
                    100: 'interact_text',
                    101: 'trade_tier',
                    102: 'max_trade_tier',
                    103: 'trade_experience',
                    104: 'skin_id',
                    105: 'spawning_frames',
                    106: 'command_block_tick_delay',
                    107: 'command_block_execute_on_first_tick',
                    108: 'ambient_sound_interval',
                    109: 'ambient_sound_interval_range',
                    110: 'ambient_sound_event_name',
                    111: 'fall_damage_multiplier',
                    112: 'name_raw_text',
                    113: 'can_ride_target',
                    114: 'low_tier_cured_discount',
                    115: 'high_tier_cured_discount',
                    116: 'nearby_cured_discount',
                    117: 'nearby_cured_discount_timestamp',
                    118: 'hitbox',
                    119: 'is_buoyant',
                    120: 'base_runtime_id',
                    121: 'freezing_effect_strength',
                    122: 'buoyancy_data',
                    123: 'goat_horn_count',
                    124: 'update_properties',
                    125: 'movement_sound_distance_offset',
                    126: 'heartbeat_interval_ticks',
                    127: 'heartbeat_sound_event',
                    128: 'player_last_death_position',
                    129: 'player_last_death_dimension',
                    130: 'player_has_died',
                    131: 'collision_box',
                    132: 'visible_mob_effects',
                  },
                },
              ],
            },
            {
              name: 'type',
              type: [
                'mapper',
                {
                  type: 'varint',
                  mappings: {
                    0: 'byte',
                    1: 'short',
                    2: 'int',
                    3: 'float',
                    4: 'string',
                    5: 'compound',
                    6: 'vec3i',
                    7: 'long',
                    8: 'vec3f',
                  },
                },
              ],
            },
            {
              name: 'value',
              type: [
                'switch',
                {
                  compareTo: 'key',
                  fields: {
                    flags: 'MetadataFlags1',
                    flags_extended: 'MetadataFlags2',
                  },
                  default: [
                    'switch',
                    {
                      compareTo: 'type',
                      fields: {
                        byte: 'i8',
                        short: 'li16',
                        int: 'zigzag32',
                        float: 'lf32',
                        string: 'string',
                        compound: 'nbt',
                        vec3i: 'vec3i',
                        long: 'zigzag64',
                        vec3f: 'vec3f',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        ],
      },
    ],
    MetadataFlags1: [
      'bitflags',
      {
        type: 'zigzag64',
        big: true,
        flags: [
          'onfire',
          'sneaking',
          'riding',
          'sprinting',
          'action',
          'invisible',
          'tempted',
          'inlove',
          'saddled',
          'powered',
          'ignited',
          'baby',
          'converting',
          'critical',
          'can_show_nametag',
          'always_show_nametag',
          'no_ai',
          'silent',
          'wallclimbing',
          'can_climb',
          'swimmer',
          'can_fly',
          'walker',
          'resting',
          'sitting',
          'angry',
          'interested',
          'charged',
          'tamed',
          'orphaned',
          'leashed',
          'sheared',
          'gliding',
          'elder',
          'moving',
          'breathing',
          'chested',
          'stackable',
          'showbase',
          'rearing',
          'vibrating',
          'idling',
          'evoker_spell',
          'charge_attack',
          'wasd_controlled',
          'can_power_jump',
          'can_dash',
          'linger',
          'has_collision',
          'affected_by_gravity',
          'fire_immune',
          'dancing',
          'enchanted',
          'show_trident_rope',
          'container_private',
          'transforming',
          'spin_attack',
          'swimming',
          'bribed',
          'pregnant',
          'laying_egg',
          'rider_can_pick',
          'transition_sitting',
          'eating',
          'laying_down',
        ],
      },
    ],
    MetadataFlags2: [
      'bitflags',
      {
        type: 'zigzag64',
        big: true,
        flags: [
          'sneezing',
          'trusting',
          'rolling',
          'scared',
          'in_scaffolding',
          'over_scaffolding',
          'fall_through_scaffolding',
          'blocking',
          'transition_blocking',
          'blocked_using_shield',
          'blocked_using_damaged_shield',
          'sleeping',
          'wants_to_wake',
          'trade_interest',
          'door_breaker',
          'breaking_obstruction',
          'door_opener',
          'illager_captain',
          'stunned',
          'roaring',
          'delayed_attacking',
          'avoiding_mobs',
          'avoiding_block',
          'facing_target_to_range_attack',
          'hidden_when_invisible',
          'is_in_ui',
          'stalking',
          'emoting',
          'celebrating',
          'admiring',
          'celebrating_special',
          'unknown95',
          'ram_attack',
          'playing_dead',
          'in_ascendable_block',
          'over_descendable_block',
          'croaking',
          'eat_mob',
          'jump_goal_jump',
          'emerging',
          'sniffing',
          'digging',
          'sonic_boom',
          'has_dash_cooldown',
          'push_towards_closest_space',
          'scenting',
          'rising',
          'feeling_happy',
          'searching',
          'crawling',
          'timer_flag_1',
          'timer_flag_2',
          'timer_flag_3',
          'body_rotation_blocked',
        ],
      },
    ],
    Link: [
      'container',
      [
        {
          name: 'ridden_entity_id',
          type: 'zigzag64',
        },
        {
          name: 'rider_entity_id',
          type: 'zigzag64',
        },
        {
          name: 'type',
          type: 'u8',
        },
        {
          name: 'immediate',
          type: 'bool',
        },
        {
          name: 'rider_initiated',
          type: 'bool',
        },
        {
          name: 'angular_velocity',
          type: 'lf32',
        },
      ],
    ],
    Links: [
      'array',
      {
        countType: 'varint',
        type: 'Link',
      },
    ],
    EntityAttributes: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'min',
              type: 'lf32',
            },
            {
              name: 'value',
              type: 'lf32',
            },
            {
              name: 'max',
              type: 'lf32',
            },
          ],
        ],
      },
    ],
    EntityProperties: [
      'container',
      [
        {
          name: 'ints',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'index',
                    type: 'varint',
                  },
                  {
                    name: 'value',
                    type: 'zigzag32',
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'floats',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'index',
                    type: 'varint',
                  },
                  {
                    name: 'value',
                    type: 'lf32',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    Rotation: [
      'container',
      [
        {
          name: 'yaw',
          type: 'byterot',
        },
        {
          name: 'pitch',
          type: 'byterot',
        },
        {
          name: 'head_yaw',
          type: 'byterot',
        },
      ],
    ],
    BlockCoordinates: [
      'container',
      [
        {
          name: 'x',
          type: 'zigzag32',
        },
        {
          name: 'y',
          type: 'varint',
        },
        {
          name: 'z',
          type: 'zigzag32',
        },
      ],
    ],
    PlayerAttributes: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'min',
              type: 'lf32',
            },
            {
              name: 'max',
              type: 'lf32',
            },
            {
              name: 'current',
              type: 'lf32',
            },
            {
              name: 'default_min',
              type: 'lf32',
            },
            {
              name: 'default_max',
              type: 'lf32',
            },
            {
              name: 'default',
              type: 'lf32',
            },
            {
              name: 'name',
              type: 'string',
            },
            {
              name: 'modifiers',
              type: [
                'array',
                {
                  countType: 'varint',
                  type: [
                    'container',
                    [
                      {
                        name: 'id',
                        type: 'string',
                      },
                      {
                        name: 'name',
                        type: 'string',
                      },
                      {
                        name: 'amount',
                        type: 'lf32',
                      },
                      {
                        name: 'operation',
                        type: 'li32',
                      },
                      {
                        name: 'operand',
                        type: 'li32',
                      },
                      {
                        name: 'serializable',
                        type: 'bool',
                      },
                    ],
                  ],
                },
              ],
            },
          ],
        ],
      },
    ],
    TransactionUseItem: [
      'container',
      [
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'click_block',
                1: 'click_air',
                2: 'break_block',
              },
            },
          ],
        },
        {
          name: 'trigger_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'unknown',
                1: 'player_input',
                2: 'simulation_tick',
              },
            },
          ],
        },
        {
          name: 'block_position',
          type: 'BlockCoordinates',
        },
        {
          name: 'face',
          type: 'zigzag32',
        },
        {
          name: 'hotbar_slot',
          type: 'zigzag32',
        },
        {
          name: 'held_item',
          type: 'Item',
        },
        {
          name: 'player_pos',
          type: 'vec3f',
        },
        {
          name: 'click_pos',
          type: 'vec3f',
        },
        {
          name: 'block_runtime_id',
          type: 'varint',
        },
        {
          name: 'client_prediction',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'failure',
                1: 'success',
              },
            },
          ],
        },
      ],
    ],
    TransactionActions: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'source_type',
              type: [
                'mapper',
                {
                  type: 'varint',
                  mappings: {
                    0: 'container',
                    1: 'global',
                    2: 'world_interaction',
                    3: 'creative',
                    100: 'craft_slot',
                    99999: 'craft',
                  },
                },
              ],
            },
            {
              anon: true,
              type: [
                'switch',
                {
                  compareTo: 'source_type',
                  fields: {
                    container: [
                      'container',
                      [
                        {
                          name: 'inventory_id',
                          type: 'WindowIDVarint',
                        },
                      ],
                    ],
                    craft: [
                      'container',
                      [
                        {
                          name: 'action',
                          type: 'varint',
                        },
                      ],
                    ],
                    world_interaction: [
                      'container',
                      [
                        {
                          name: 'flags',
                          type: 'varint',
                        },
                      ],
                    ],
                    craft_slot: [
                      'container',
                      [
                        {
                          name: 'action',
                          type: 'varint',
                        },
                      ],
                    ],
                  },
                  default: 'void',
                },
              ],
            },
            {
              name: 'slot',
              type: 'varint',
            },
            {
              name: 'old_item',
              type: 'Item',
            },
            {
              name: 'new_item',
              type: 'Item',
            },
          ],
        ],
      },
    ],
    TransactionLegacy: [
      'container',
      [
        {
          name: 'legacy_request_id',
          type: 'zigzag32',
        },
        {
          name: 'legacy_transactions',
          type: [
            'switch',
            {
              compareTo: 'legacy_request_id',
              fields: {
                0: 'void',
              },
              default: [
                'array',
                {
                  countType: 'varint',
                  type: [
                    'container',
                    [
                      {
                        name: 'container_id',
                        type: 'u8',
                      },
                      {
                        name: 'changed_slots',
                        type: [
                          'array',
                          {
                            countType: 'varint',
                            type: [
                              'container',
                              [
                                {
                                  name: 'slot_id',
                                  type: 'u8',
                                },
                              ],
                            ],
                          },
                        ],
                      },
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ],
    ],
    Transaction: [
      'container',
      [
        {
          name: 'legacy',
          type: 'TransactionLegacy',
        },
        {
          name: 'transaction_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'normal',
                1: 'inventory_mismatch',
                2: 'item_use',
                3: 'item_use_on_entity',
                4: 'item_release',
              },
            },
          ],
        },
        {
          name: 'actions',
          type: 'TransactionActions',
        },
        {
          name: 'transaction_data',
          type: [
            'switch',
            {
              compareTo: 'transaction_type',
              fields: {
                normal: 'void',
                inventory_mismatch: 'void',
                item_use: 'TransactionUseItem',
                item_use_on_entity: [
                  'container',
                  [
                    {
                      name: 'entity_runtime_id',
                      type: 'varint64',
                    },
                    {
                      name: 'action_type',
                      type: [
                        'mapper',
                        {
                          type: 'varint',
                          mappings: {
                            0: 'interact',
                            1: 'attack',
                          },
                        },
                      ],
                    },
                    {
                      name: 'hotbar_slot',
                      type: 'zigzag32',
                    },
                    {
                      name: 'held_item',
                      type: 'Item',
                    },
                    {
                      name: 'player_pos',
                      type: 'vec3f',
                    },
                    {
                      name: 'click_pos',
                      type: 'vec3f',
                    },
                  ],
                ],
                item_release: [
                  'container',
                  [
                    {
                      name: 'action_type',
                      type: [
                        'mapper',
                        {
                          type: 'varint',
                          mappings: {
                            0: 'release',
                            1: 'consume',
                          },
                        },
                      ],
                    },
                    {
                      name: 'hotbar_slot',
                      type: 'zigzag32',
                    },
                    {
                      name: 'held_item',
                      type: 'Item',
                    },
                    {
                      name: 'head_pos',
                      type: 'vec3f',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    ItemStacks: [
      'array',
      {
        countType: 'varint',
        type: 'Item',
      },
    ],
    RecipeIngredient: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'invalid',
                1: 'int_id_meta',
                2: 'molang',
                3: 'item_tag',
                4: 'string_id_meta',
                5: 'complex_alias',
              },
            },
          ],
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                int_id_meta: [
                  'container',
                  [
                    {
                      name: 'network_id',
                      type: 'li16',
                    },
                    {
                      name: 'metadata',
                      type: [
                        'switch',
                        {
                          compareTo: 'network_id',
                          fields: {
                            0: 'void',
                          },
                          default: 'li16',
                        },
                      ],
                    },
                  ],
                ],
                molang: [
                  'container',
                  [
                    {
                      name: 'expression',
                      type: 'string',
                    },
                    {
                      name: 'version',
                      type: 'u8',
                    },
                  ],
                ],
                item_tag: [
                  'container',
                  [
                    {
                      name: 'tag',
                      type: 'string',
                    },
                  ],
                ],
                string_id_meta: [
                  'container',
                  [
                    {
                      name: 'name',
                      type: 'string',
                    },
                    {
                      name: 'metadata',
                      type: 'li16',
                    },
                  ],
                ],
                complex_alias: [
                  'container',
                  [
                    {
                      name: 'name',
                      type: 'string',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'count',
          type: 'zigzag32',
        },
      ],
    ],
    PotionTypeRecipes: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'input_item_id',
              type: 'zigzag32',
            },
            {
              name: 'input_item_meta',
              type: 'zigzag32',
            },
            {
              name: 'ingredient_id',
              type: 'zigzag32',
            },
            {
              name: 'ingredient_meta',
              type: 'zigzag32',
            },
            {
              name: 'output_item_id',
              type: 'zigzag32',
            },
            {
              name: 'output_item_meta',
              type: 'zigzag32',
            },
          ],
        ],
      },
    ],
    PotionContainerChangeRecipes: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'input_item_id',
              type: 'zigzag32',
            },
            {
              name: 'ingredient_id',
              type: 'zigzag32',
            },
            {
              name: 'output_item_id',
              type: 'zigzag32',
            },
          ],
        ],
      },
    ],
    Recipes: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'type',
              type: [
                'mapper',
                {
                  type: 'zigzag32',
                  mappings: {
                    0: 'shapeless',
                    1: 'shaped',
                    2: 'furnace',
                    3: 'furnace_with_metadata',
                    4: 'multi',
                    5: 'shulker_box',
                    6: 'shapeless_chemistry',
                    7: 'shaped_chemistry',
                    8: 'smithing_transform',
                    9: 'smithing_trim',
                  },
                },
              ],
            },
            {
              name: 'recipe',
              type: [
                'switch',
                {
                  compareTo: 'type',
                  fields: {
                    shapeless: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'input',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'RecipeIngredient',
                            },
                          ],
                        },
                        {
                          name: 'output',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'ItemLegacy',
                            },
                          ],
                        },
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'priority',
                          type: 'zigzag32',
                        },
                        {
                          name: 'unlocking_requirement',
                          type: 'RecipeUnlockingRequirement',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    shulker_box: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'input',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'RecipeIngredient',
                            },
                          ],
                        },
                        {
                          name: 'output',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'ItemLegacy',
                            },
                          ],
                        },
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'priority',
                          type: 'zigzag32',
                        },
                        {
                          name: 'unlocking_requirement',
                          type: 'RecipeUnlockingRequirement',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    shapeless_chemistry: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'input',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'RecipeIngredient',
                            },
                          ],
                        },
                        {
                          name: 'output',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'ItemLegacy',
                            },
                          ],
                        },
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'priority',
                          type: 'zigzag32',
                        },
                        {
                          name: 'unlocking_requirement',
                          type: 'RecipeUnlockingRequirement',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    shaped: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'width',
                          type: 'zigzag32',
                        },
                        {
                          name: 'height',
                          type: 'zigzag32',
                        },
                        {
                          name: 'input',
                          type: [
                            'array',
                            {
                              count: 'width',
                              type: [
                                'array',
                                {
                                  count: 'height',
                                  type: 'RecipeIngredient',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: 'output',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'ItemLegacy',
                            },
                          ],
                        },
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'priority',
                          type: 'zigzag32',
                        },
                        {
                          name: 'assume_symmetry',
                          type: 'bool',
                        },
                        {
                          name: 'unlocking_requirement',
                          type: 'RecipeUnlockingRequirement',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    shaped_chemistry: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'width',
                          type: 'zigzag32',
                        },
                        {
                          name: 'height',
                          type: 'zigzag32',
                        },
                        {
                          name: 'input',
                          type: [
                            'array',
                            {
                              count: 'width',
                              type: [
                                'array',
                                {
                                  count: 'height',
                                  type: 'RecipeIngredient',
                                },
                              ],
                            },
                          ],
                        },
                        {
                          name: 'output',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: 'ItemLegacy',
                            },
                          ],
                        },
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'priority',
                          type: 'zigzag32',
                        },
                        {
                          name: 'assume_symmetry',
                          type: 'bool',
                        },
                        {
                          name: 'unlocking_requirement',
                          type: 'RecipeUnlockingRequirement',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    furnace: [
                      'container',
                      [
                        {
                          name: 'input_id',
                          type: 'zigzag32',
                        },
                        {
                          name: 'output',
                          type: 'ItemLegacy',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                      ],
                    ],
                    furnace_with_metadata: [
                      'container',
                      [
                        {
                          name: 'input_id',
                          type: 'zigzag32',
                        },
                        {
                          name: 'input_meta',
                          type: 'zigzag32',
                        },
                        {
                          name: 'output',
                          type: 'ItemLegacy',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                      ],
                    ],
                    multi: [
                      'container',
                      [
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    smithing_transform: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'template',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'base',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'addition',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'result',
                          type: 'ItemLegacy',
                        },
                        {
                          name: 'tag',
                          type: 'string',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                    smithing_trim: [
                      'container',
                      [
                        {
                          name: 'recipe_id',
                          type: 'LatinString',
                        },
                        {
                          name: 'template',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'input',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'addition',
                          type: 'RecipeIngredient',
                        },
                        {
                          name: 'block',
                          type: 'string',
                        },
                        {
                          name: 'network_id',
                          type: 'varint',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        ],
      },
    ],
    RecipeUnlockingRequirement: [
      'container',
      [
        {
          name: 'context',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'always_unlocked',
                2: 'player_in_water',
                3: 'player_has_many_items',
              },
            },
          ],
        },
        {
          name: 'ingredients',
          type: [
            'switch',
            {
              compareTo: 'context',
              fields: {
                none: [
                  'array',
                  {
                    countType: 'varint',
                    type: 'RecipeIngredient',
                  },
                ],
              },
            },
          ],
        },
      ],
    ],
    SkinImage: [
      'container',
      [
        {
          name: 'width',
          type: 'li32',
        },
        {
          name: 'height',
          type: 'li32',
        },
        {
          name: 'data',
          type: 'ByteArray',
        },
      ],
    ],
    Skin: [
      'container',
      [
        {
          name: 'skin_id',
          type: 'string',
        },
        {
          name: 'play_fab_id',
          type: 'string',
        },
        {
          name: 'skin_resource_pack',
          type: 'string',
        },
        {
          name: 'skin_data',
          type: 'SkinImage',
        },
        {
          name: 'animations',
          type: [
            'array',
            {
              countType: 'li32',
              type: [
                'container',
                [
                  {
                    name: 'skin_image',
                    type: 'SkinImage',
                  },
                  {
                    name: 'animation_type',
                    type: 'li32',
                  },
                  {
                    name: 'animation_frames',
                    type: 'lf32',
                  },
                  {
                    name: 'expression_type',
                    type: 'lf32',
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'cape_data',
          type: 'SkinImage',
        },
        {
          name: 'geometry_data',
          type: 'string',
        },
        {
          name: 'geometry_data_version',
          type: 'string',
        },
        {
          name: 'animation_data',
          type: 'string',
        },
        {
          name: 'cape_id',
          type: 'string',
        },
        {
          name: 'full_skin_id',
          type: 'string',
        },
        {
          name: 'arm_size',
          type: 'string',
        },
        {
          name: 'skin_color',
          type: 'string',
        },
        {
          name: 'personal_pieces',
          type: [
            'array',
            {
              countType: 'li32',
              type: [
                'container',
                [
                  {
                    name: 'piece_id',
                    type: 'string',
                  },
                  {
                    name: 'piece_type',
                    type: 'string',
                  },
                  {
                    name: 'pack_id',
                    type: 'string',
                  },
                  {
                    name: 'is_default_piece',
                    type: 'bool',
                  },
                  {
                    name: 'product_id',
                    type: 'string',
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'piece_tint_colors',
          type: [
            'array',
            {
              countType: 'li32',
              type: [
                'container',
                [
                  {
                    name: 'piece_type',
                    type: 'string',
                  },
                  {
                    name: 'colors',
                    type: [
                      'array',
                      {
                        countType: 'li32',
                        type: 'string',
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'premium',
          type: 'bool',
        },
        {
          name: 'persona',
          type: 'bool',
        },
        {
          name: 'cape_on_classic',
          type: 'bool',
        },
        {
          name: 'primary_user',
          type: 'bool',
        },
        {
          name: 'overriding_player_appearance',
          type: 'bool',
        },
      ],
    ],
    PlayerRecords: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'add',
                1: 'remove',
              },
            },
          ],
        },
        {
          name: 'records_count',
          type: 'varint',
        },
        {
          name: 'records',
          type: [
            'array',
            {
              count: 'records_count',
              type: [
                'switch',
                {
                  compareTo: 'type',
                  fields: {
                    add: [
                      'container',
                      [
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                        {
                          name: 'entity_unique_id',
                          type: 'zigzag64',
                        },
                        {
                          name: 'username',
                          type: 'string',
                        },
                        {
                          name: 'xbox_user_id',
                          type: 'string',
                        },
                        {
                          name: 'platform_chat_id',
                          type: 'string',
                        },
                        {
                          name: 'build_platform',
                          type: 'li32',
                        },
                        {
                          name: 'skin_data',
                          type: 'Skin',
                        },
                        {
                          name: 'is_teacher',
                          type: 'bool',
                        },
                        {
                          name: 'is_host',
                          type: 'bool',
                        },
                        {
                          name: 'is_subclient',
                          type: 'bool',
                        },
                      ],
                    ],
                    remove: [
                      'container',
                      [
                        {
                          name: 'uuid',
                          type: 'uuid',
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'verified',
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                add: [
                  'array',
                  {
                    count: 'records_count',
                    type: 'bool',
                  },
                ],
              },
            },
          ],
        },
      ],
    ],
    Enchant: [
      'container',
      [
        {
          name: 'id',
          type: 'u8',
        },
        {
          name: 'level',
          type: 'u8',
        },
      ],
    ],
    EnchantOption: [
      'container',
      [
        {
          name: 'cost',
          type: 'varint',
        },
        {
          name: 'slot_flags',
          type: 'li32',
        },
        {
          name: 'equip_enchants',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Enchant',
            },
          ],
        },
        {
          name: 'held_enchants',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Enchant',
            },
          ],
        },
        {
          name: 'self_enchants',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Enchant',
            },
          ],
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'option_id',
          type: 'zigzag32',
        },
      ],
    ],
    Action: [
      'mapper',
      {
        type: 'zigzag32',
        mappings: {
          0: 'start_break',
          1: 'abort_break',
          2: 'stop_break',
          3: 'get_updated_block',
          4: 'drop_item',
          5: 'start_sleeping',
          6: 'stop_sleeping',
          7: 'respawn',
          8: 'jump',
          9: 'start_sprint',
          10: 'stop_sprint',
          11: 'start_sneak',
          12: 'stop_sneak',
          13: 'creative_player_destroy_block',
          14: 'dimension_change_ack',
          15: 'start_glide',
          16: 'stop_glide',
          17: 'build_denied',
          18: 'crack_break',
          19: 'change_skin',
          20: 'set_enchatnment_seed',
          21: 'swimming',
          22: 'stop_swimming',
          23: 'start_spin_attack',
          24: 'stop_spin_attack',
          25: 'interact_block',
          26: 'predict_break',
          27: 'continue_break',
          28: 'start_item_use_on',
          29: 'stop_item_use_on',
          30: 'handled_teleport',
          31: 'missed_swing',
          32: 'start_crawling',
          33: 'stop_crawling',
          34: 'start_flying',
          35: 'stop_flying',
          36: 'received_server_data',
          37: 'start_using_item',
        },
      },
    ],
    StackRequestSlotInfo: [
      'container',
      [
        {
          name: 'slot_type',
          type: 'FullContainerName',
        },
        {
          name: 'slot',
          type: 'u8',
        },
        {
          name: 'stack_id',
          type: 'zigzag32',
        },
      ],
    ],
    ItemStackRequest: [
      'container',
      [
        {
          name: 'request_id',
          type: 'zigzag32',
        },
        {
          name: 'actions',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'type_id',
                    type: [
                      'mapper',
                      {
                        type: 'u8',
                        mappings: {
                          0: 'take',
                          1: 'place',
                          2: 'swap',
                          3: 'drop',
                          4: 'destroy',
                          5: 'consume',
                          6: 'create',
                          7: 'place_in_container',
                          8: 'take_out_container',
                          9: 'lab_table_combine',
                          10: 'beacon_payment',
                          11: 'mine_block',
                          12: 'craft_recipe',
                          13: 'craft_recipe_auto',
                          14: 'craft_creative',
                          15: 'optional',
                          16: 'craft_grindstone_request',
                          17: 'craft_loom_request',
                          18: 'non_implemented',
                          19: 'results_deprecated',
                        },
                      },
                    ],
                  },
                  {
                    anon: true,
                    type: [
                      'switch',
                      {
                        compareTo: 'type_id',
                        fields: {
                          take: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'destination',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          place: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'destination',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          place_in_container: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'destination',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          take_out_container: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'destination',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          swap: [
                            'container',
                            [
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'destination',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          drop: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                              {
                                name: 'randomly',
                                type: 'bool',
                              },
                            ],
                          ],
                          destroy: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          consume: [
                            'container',
                            [
                              {
                                name: 'count',
                                type: 'u8',
                              },
                              {
                                name: 'source',
                                type: 'StackRequestSlotInfo',
                              },
                            ],
                          ],
                          create: [
                            'container',
                            [
                              {
                                name: 'result_slot_id',
                                type: 'u8',
                              },
                            ],
                          ],
                          beacon_payment: [
                            'container',
                            [
                              {
                                name: 'primary_effect',
                                type: 'zigzag32',
                              },
                              {
                                name: 'secondary_effect',
                                type: 'zigzag32',
                              },
                            ],
                          ],
                          mine_block: [
                            'container',
                            [
                              {
                                name: 'hotbar_slot',
                                type: 'zigzag32',
                              },
                              {
                                name: 'predicted_durability',
                                type: 'zigzag32',
                              },
                              {
                                name: 'network_id',
                                type: 'zigzag32',
                              },
                            ],
                          ],
                          craft_recipe: [
                            'container',
                            [
                              {
                                name: 'recipe_network_id',
                                type: 'varint',
                              },
                              {
                                name: 'times_crafted',
                                type: 'u8',
                              },
                            ],
                          ],
                          craft_recipe_auto: [
                            'container',
                            [
                              {
                                name: 'recipe_network_id',
                                type: 'varint',
                              },
                              {
                                name: 'times_crafted_2',
                                type: 'u8',
                              },
                              {
                                name: 'times_crafted',
                                type: 'u8',
                              },
                              {
                                name: 'ingredients',
                                type: [
                                  'array',
                                  {
                                    countType: 'varint',
                                    type: 'RecipeIngredient',
                                  },
                                ],
                              },
                            ],
                          ],
                          craft_creative: [
                            'container',
                            [
                              {
                                name: 'item_id',
                                type: 'varint',
                              },
                              {
                                name: 'times_crafted',
                                type: 'u8',
                              },
                            ],
                          ],
                          optional: [
                            'container',
                            [
                              {
                                name: 'recipe_network_id',
                                type: 'varint',
                              },
                              {
                                name: 'filtered_string_index',
                                type: 'li32',
                              },
                            ],
                          ],
                          craft_grindstone_request: [
                            'container',
                            [
                              {
                                name: 'recipe_network_id',
                                type: 'varint',
                              },
                              {
                                name: 'cost',
                                type: 'varint',
                              },
                            ],
                          ],
                          craft_loom_request: [
                            'container',
                            [
                              {
                                name: 'pattern',
                                type: 'string',
                              },
                            ],
                          ],
                          non_implemented: 'void',
                          results_deprecated: [
                            'container',
                            [
                              {
                                name: 'result_items',
                                type: [
                                  'array',
                                  {
                                    countType: 'varint',
                                    type: 'ItemLegacy',
                                  },
                                ],
                              },
                              {
                                name: 'times_crafted',
                                type: 'u8',
                              },
                            ],
                          ],
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'custom_names',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
        {
          name: 'cause',
          type: [
            'mapper',
            {
              type: 'li32',
              mappings: {
                0: 'chat_public',
                1: 'chat_whisper',
                2: 'sign_text',
                3: 'anvil_text',
                4: 'book_and_quill_text',
                5: 'command_block_text',
                6: 'block_actor_data_text',
                7: 'join_event_text',
                8: 'leave_event_text',
                9: 'slash_command_chat',
                10: 'cartography_text',
                11: 'kick_command',
                12: 'title_command',
                13: 'summon_command',
              },
            },
          ],
        },
      ],
    ],
    ItemStackResponses: [
      'array',
      {
        countType: 'varint',
        type: [
          'container',
          [
            {
              name: 'status',
              type: [
                'mapper',
                {
                  type: 'u8',
                  mappings: {
                    0: 'ok',
                    1: 'error',
                  },
                },
              ],
            },
            {
              name: 'request_id',
              type: 'zigzag32',
            },
            {
              anon: true,
              type: [
                'switch',
                {
                  compareTo: 'status',
                  fields: {
                    ok: [
                      'container',
                      [
                        {
                          name: 'containers',
                          type: [
                            'array',
                            {
                              countType: 'varint',
                              type: [
                                'container',
                                [
                                  {
                                    name: 'slot_type',
                                    type: 'FullContainerName',
                                  },
                                  {
                                    name: 'slots',
                                    type: [
                                      'array',
                                      {
                                        countType: 'varint',
                                        type: [
                                          'container',
                                          [
                                            {
                                              name: 'slot',
                                              type: 'u8',
                                            },
                                            {
                                              name: 'hotbar_slot',
                                              type: 'u8',
                                            },
                                            {
                                              name: 'count',
                                              type: 'u8',
                                            },
                                            {
                                              name: 'item_stack_id',
                                              type: 'zigzag32',
                                            },
                                            {
                                              name: 'custom_name',
                                              type: 'string',
                                            },
                                            {
                                              name: 'filtered_custom_name',
                                              type: 'string',
                                            },
                                            {
                                              name: 'durability_correction',
                                              type: 'zigzag32',
                                            },
                                          ],
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  },
                },
              ],
            },
          ],
        ],
      },
    ],
    ItemData: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'network_id',
          type: 'li16',
        },
        {
          name: 'component_based',
          type: 'bool',
        },
        {
          name: 'version',
          type: 'varint',
        },
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    CommandOrigin: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'player',
                1: 'block',
                2: 'minecart_block',
                3: 'dev_console',
                4: 'test',
                5: 'automation_player',
                6: 'client_automation',
                7: 'dedicated_server',
                8: 'entity',
                9: 'virtual',
                10: 'game_argument',
                11: 'entity_server',
                12: 'precompiled',
                13: 'game_director_entity_server',
                14: 'script',
                15: 'executor',
              },
            },
          ],
        },
        {
          name: 'uuid',
          type: 'uuid',
        },
        {
          name: 'request_id',
          type: 'string',
        },
        {
          name: 'player_entity_id',
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                dev_console: [
                  'container',
                  [
                    {
                      name: 'player_entity_id',
                      type: 'zigzag64',
                    },
                  ],
                ],
                test: [
                  'container',
                  [
                    {
                      name: 'player_entity_id',
                      type: 'zigzag64',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    TrackedObject: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'li32',
              mappings: {
                0: 'entity',
                1: 'block',
              },
            },
          ],
        },
        {
          name: 'entity_unique_id',
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                entity: 'zigzag64',
              },
            },
          ],
        },
        {
          name: 'block_position',
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                block: 'BlockCoordinates',
              },
            },
          ],
        },
      ],
    ],
    MapDecoration: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'marker_white',
                1: 'marker_green',
                2: 'marker_red',
                3: 'marker_blue',
                4: 'cross_white',
                5: 'triangle_red',
                6: 'square_white',
                7: 'marker_sign',
                8: 'marker_pink',
                9: 'marker_orange',
                10: 'marker_yellow',
                11: 'marker_teal',
                12: 'triangle_green',
                13: 'small_square_white',
                14: 'mansion',
                15: 'monument',
                16: 'no_draw',
                17: 'village_desert',
                18: 'village_plains',
                19: 'village_savanna',
                20: 'village_snowy',
                21: 'village_taiga',
                22: 'jungle_temple',
                23: 'witch_hut =>',
                24: 'marker_white',
                25: 'marker_green',
                26: 'marker_red',
                27: 'marker_blue',
                28: 'cross_white',
                29: 'triangle_red',
                30: 'square_white',
                31: 'marker_sign',
                32: 'marker_pink',
                33: 'marker_orange',
                34: 'marker_yellow',
                35: 'marker_teal',
                36: 'triangle_green',
                37: 'small_square_white',
                38: 'mansion',
                39: 'monument',
                40: 'no_draw',
                41: 'village_desert',
                42: 'village_plains',
                43: 'village_savanna',
                44: 'village_snowy',
                45: 'village_taiga',
                46: 'jungle_temple',
                47: 'witch_hut',
              },
            },
          ],
        },
        {
          name: 'rotation',
          type: 'u8',
        },
        {
          name: 'x',
          type: 'u8',
        },
        {
          name: 'y',
          type: 'u8',
        },
        {
          name: 'label',
          type: 'string',
        },
        {
          name: 'color_abgr',
          type: 'varint',
        },
      ],
    ],
    StructureBlockSettings: [
      'container',
      [
        {
          name: 'palette_name',
          type: 'string',
        },
        {
          name: 'ignore_entities',
          type: 'bool',
        },
        {
          name: 'ignore_blocks',
          type: 'bool',
        },
        {
          name: 'non_ticking_players_and_ticking_areas',
          type: 'bool',
        },
        {
          name: 'size',
          type: 'BlockCoordinates',
        },
        {
          name: 'structure_offset',
          type: 'BlockCoordinates',
        },
        {
          name: 'last_editing_player_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'rotation',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: '90_deg',
                2: '180_deg',
                3: '270_deg',
              },
            },
          ],
        },
        {
          name: 'mirror',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'x_axis',
                2: 'z_axis',
                3: 'both_axes',
              },
            },
          ],
        },
        {
          name: 'animation_mode',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'layers',
                2: 'blocks',
              },
            },
          ],
        },
        {
          name: 'animation_duration',
          type: 'lf32',
        },
        {
          name: 'integrity',
          type: 'lf32',
        },
        {
          name: 'seed',
          type: 'lu32',
        },
        {
          name: 'pivot',
          type: 'vec3f',
        },
      ],
    ],
    EducationSharedResourceURI: [
      'container',
      [
        {
          name: 'button_name',
          type: 'string',
        },
        {
          name: 'link_uri',
          type: 'string',
        },
      ],
    ],
    EducationExternalLinkSettings: [
      'container',
      [
        {
          name: 'url',
          type: 'string',
        },
        {
          name: 'display_name',
          type: 'string',
        },
      ],
    ],
    BlockUpdate: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'runtime_id',
          type: 'varint',
        },
        {
          name: 'flags',
          type: 'varint',
        },
        {
          name: 'entity_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'transition_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'entity',
                1: 'create',
                2: 'destroy',
              },
            },
          ],
        },
      ],
    ],
    MaterialReducer: [
      'container',
      [
        {
          name: 'mix',
          type: 'zigzag32',
        },
        {
          name: 'items',
          type: [
            'container',
            [
              {
                name: 'network_id',
                type: 'zigzag32',
              },
              {
                name: 'count',
                type: 'zigzag32',
              },
            ],
          ],
        },
      ],
    ],
    PermissionLevel: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'visitor',
          1: 'member',
          2: 'operator',
          3: 'custom',
        },
      },
    ],
    CommandPermissionLevel: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'normal',
          1: 'operator',
          2: 'automation',
          3: 'host',
          4: 'owner',
          5: 'internal',
        },
      },
    ],
    CommandPermissionLevelVarint: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'normal',
          1: 'operator',
          2: 'automation',
          3: 'host',
          4: 'owner',
          5: 'internal',
        },
      },
    ],
    WindowID: [
      'mapper',
      {
        type: 'i8',
        mappings: {
          '0': 'inventory',
          '1': 'first',
          '100': 'last',
          '119': 'offhand',
          '120': 'armor',
          '121': 'creative',
          '122': 'hotbar',
          '123': 'fixed_inventory',
          '124': 'ui',
          '-100': 'drop_contents',
          '-24': 'beacon',
          '-23': 'trading_output',
          '-22': 'trading_use_inputs',
          '-21': 'trading_input_2',
          '-20': 'trading_input_1',
          '-17': 'enchant_output',
          '-16': 'enchant_material',
          '-15': 'enchant_input',
          '-13': 'anvil_output',
          '-12': 'anvil_result',
          '-11': 'anvil_material',
          '-10': 'container_input',
          '-5': 'crafting_use_ingredient',
          '-4': 'crafting_result',
          '-3': 'crafting_remove_ingredient',
          '-2': 'crafting_add_ingredient',
          '-1': 'none',
        },
      },
    ],
    WindowIDVarint: [
      'mapper',
      {
        type: 'varint',
        mappings: {
          '0': 'inventory',
          '1': 'first',
          '100': 'last',
          '119': 'offhand',
          '120': 'armor',
          '121': 'creative',
          '122': 'hotbar',
          '123': 'fixed_inventory',
          '124': 'ui',
          '-100': 'drop_contents',
          '-24': 'beacon',
          '-23': 'trading_output',
          '-22': 'trading_use_inputs',
          '-21': 'trading_input_2',
          '-20': 'trading_input_1',
          '-17': 'enchant_output',
          '-16': 'enchant_material',
          '-15': 'enchant_input',
          '-13': 'anvil_output',
          '-12': 'anvil_result',
          '-11': 'anvil_material',
          '-10': 'container_input',
          '-5': 'crafting_use_ingredient',
          '-4': 'crafting_result',
          '-3': 'crafting_remove_ingredient',
          '-2': 'crafting_add_ingredient',
          '-1': 'none',
        },
      },
    ],
    WindowType: [
      'mapper',
      {
        type: 'i8',
        mappings: {
          '0': 'container',
          '1': 'workbench',
          '2': 'furnace',
          '3': 'enchantment',
          '4': 'brewing_stand',
          '5': 'anvil',
          '6': 'dispenser',
          '7': 'dropper',
          '8': 'hopper',
          '9': 'cauldron',
          '10': 'minecart_chest',
          '11': 'minecart_hopper',
          '12': 'horse',
          '13': 'beacon',
          '14': 'structure_editor',
          '15': 'trading',
          '16': 'command_block',
          '17': 'jukebox',
          '18': 'armor',
          '19': 'hand',
          '20': 'compound_creator',
          '21': 'element_constructor',
          '22': 'material_reducer',
          '23': 'lab_table',
          '24': 'loom',
          '25': 'lectern',
          '26': 'grindstone',
          '27': 'blast_furnace',
          '28': 'smoker',
          '29': 'stonecutter',
          '30': 'cartography',
          '31': 'hud',
          '32': 'jigsaw_editor',
          '33': 'smithing_table',
          '34': 'chest_boat',
          '35': 'decorated_pot',
          '36': 'crafter',
          '-9': 'none',
          '-1': 'inventory',
        },
      },
    ],
    ContainerSlotType: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'anvil_input',
          1: 'anvil_material',
          2: 'anvil_result',
          3: 'smithing_table_input',
          4: 'smithing_table_material',
          5: 'smithing_table_result',
          6: 'armor',
          7: 'container',
          8: 'beacon_payment',
          9: 'brewing_input',
          10: 'brewing_result',
          11: 'brewing_fuel',
          12: 'hotbar_and_inventory',
          13: 'crafting_input',
          14: 'crafting_output',
          15: 'recipe_construction',
          16: 'recipe_nature',
          17: 'recipe_items',
          18: 'recipe_search',
          19: 'recipe_search_bar',
          20: 'recipe_equipment',
          21: 'recipe_book',
          22: 'enchanting_input',
          23: 'enchanting_lapis',
          24: 'furnace_fuel',
          25: 'furnace_ingredient',
          26: 'furnace_output',
          27: 'horse_equip',
          28: 'hotbar',
          29: 'inventory',
          30: 'shulker',
          31: 'trade_ingredient1',
          32: 'trade_ingredient2',
          33: 'trade_result',
          34: 'offhand',
          35: 'compcreate_input',
          36: 'compcreate_output',
          37: 'elemconstruct_output',
          38: 'matreduce_input',
          39: 'matreduce_output',
          40: 'labtable_input',
          41: 'loom_input',
          42: 'loom_dye',
          43: 'loom_material',
          44: 'loom_result',
          45: 'blast_furnace_ingredient',
          46: 'smoker_ingredient',
          47: 'trade2_ingredient1',
          48: 'trade2_ingredient2',
          49: 'trade2_result',
          50: 'grindstone_input',
          51: 'grindstone_additional',
          52: 'grindstone_result',
          53: 'stonecutter_input',
          54: 'stonecutter_result',
          55: 'cartography_input',
          56: 'cartography_additional',
          57: 'cartography_result',
          58: 'barrel',
          59: 'cursor',
          60: 'creative_output',
          61: 'smithing_table_template',
          62: 'crafter',
          63: 'dynamic',
          64: 'registry',
        },
      },
    ],
    SoundType: [
      'mapper',
      {
        type: 'varint',
        mappings: {
          0: 'ItemUseOn',
          1: 'Hit',
          2: 'Step',
          3: 'Fly',
          4: 'Jump',
          5: 'Break',
          6: 'Place',
          7: 'HeavyStep',
          8: 'Gallop',
          9: 'Fall',
          10: 'Ambient',
          11: 'AmbientBaby',
          12: 'AmbientInWater',
          13: 'Breathe',
          14: 'Death',
          15: 'DeathInWater',
          16: 'DeathToZombie',
          17: 'Hurt',
          18: 'HurtInWater',
          19: 'Mad',
          20: 'Boost',
          21: 'Bow',
          22: 'SquishBig',
          23: 'SquishSmall',
          24: 'FallBig',
          25: 'FallSmall',
          26: 'Splash',
          27: 'Fizz',
          28: 'Flap',
          29: 'Swim',
          30: 'Drink',
          31: 'Eat',
          32: 'Takeoff',
          33: 'Shake',
          34: 'Plop',
          35: 'Land',
          36: 'Saddle',
          37: 'Armor',
          38: 'MobArmorStandPlace',
          39: 'AddChest',
          40: 'Throw',
          41: 'Attack',
          42: 'AttackNoDamage',
          43: 'AttackStrong',
          44: 'Warn',
          45: 'Shear',
          46: 'Milk',
          47: 'Thunder',
          48: 'Explode',
          49: 'Fire',
          50: 'Ignite',
          51: 'Fuse',
          52: 'Stare',
          53: 'Spawn',
          54: 'Shoot',
          55: 'BreakBlock',
          56: 'Launch',
          57: 'Blast',
          58: 'LargeBlast',
          59: 'Twinkle',
          60: 'Remedy',
          61: 'Infect',
          62: 'LevelUp',
          63: 'BowHit',
          64: 'BulletHit',
          65: 'ExtinguishFire',
          66: 'ItemFizz',
          67: 'ChestOpen',
          68: 'ChestClosed',
          69: 'ShulkerBoxOpen',
          70: 'ShulkerBoxClosed',
          71: 'EnderChestOpen',
          72: 'EnderChestClosed',
          73: 'PowerOn',
          74: 'PowerOff',
          75: 'Attach',
          76: 'Detach',
          77: 'Deny',
          78: 'Tripod',
          79: 'Pop',
          80: 'DropSlot',
          81: 'Note',
          82: 'Thorns',
          83: 'PistonIn',
          84: 'PistonOut',
          85: 'Portal',
          86: 'Water',
          87: 'LavaPop',
          88: 'Lava',
          89: 'Burp',
          90: 'BucketFillWater',
          91: 'BucketFillLava',
          92: 'BucketEmptyWater',
          93: 'BucketEmptyLava',
          94: 'ArmorEquipChain',
          95: 'ArmorEquipDiamond',
          96: 'ArmorEquipGeneric',
          97: 'ArmorEquipGold',
          98: 'ArmorEquipIron',
          99: 'ArmorEquipLeather',
          100: 'ArmorEquipElytra',
          101: 'Record13',
          102: 'RecordCat',
          103: 'RecordBlocks',
          104: 'RecordChirp',
          105: 'RecordFar',
          106: 'RecordMall',
          107: 'RecordMellohi',
          108: 'RecordStal',
          109: 'RecordStrad',
          110: 'RecordWard',
          111: 'Record11',
          112: 'RecordWait',
          113: 'StopRecord',
          114: 'Flop',
          115: 'GuardianCurse',
          116: 'MobWarning',
          117: 'MobWarningBaby',
          118: 'Teleport',
          119: 'ShulkerOpen',
          120: 'ShulkerClose',
          121: 'Haggle',
          122: 'HaggleYes',
          123: 'HaggleNo',
          124: 'HaggleIdle',
          125: 'ChorusGrow',
          126: 'ChorusDeath',
          127: 'Glass',
          128: 'PotionBrewed',
          129: 'CastSpell',
          130: 'PrepareAttackSpell',
          131: 'PrepareSummon',
          132: 'PrepareWololo',
          133: 'Fang',
          134: 'Charge',
          135: 'CameraTakePicture',
          136: 'LeashKnotPlace',
          137: 'LeashKnotBreak',
          138: 'AmbientGrowl',
          139: 'AmbientWhine',
          140: 'AmbientPant',
          141: 'AmbientPurr',
          142: 'AmbientPurreow',
          143: 'DeathMinVolume',
          144: 'DeathMidVolume',
          145: 'ImitateBlaze',
          146: 'ImitateCaveSpider',
          147: 'ImitateCreeper',
          148: 'ImitateElderGuardian',
          149: 'ImitateEnderDragon',
          150: 'ImitateEnderman',
          151: 'ImitateEndermite',
          152: 'ImitateEvocationIllager',
          153: 'ImitateGhast',
          154: 'ImitateHusk',
          155: 'ImitateIllusionIllager',
          156: 'ImitateMagmaCube',
          157: 'ImitatePolarBear',
          158: 'ImitateShulker',
          159: 'ImitateSilverfish',
          160: 'ImitateSkeleton',
          161: 'ImitateSlime',
          162: 'ImitateSpider',
          163: 'ImitateStray',
          164: 'ImitateVex',
          165: 'ImitateVindicationIllager',
          166: 'ImitateWitch',
          167: 'ImitateWither',
          168: 'ImitateWitherSkeleton',
          169: 'ImitateWolf',
          170: 'ImitateZombie',
          171: 'ImitateZombiePigman',
          172: 'ImitateZombieVillager',
          173: 'EnderEyePlaced',
          174: 'EndPortalCreated',
          175: 'AnvilUse',
          176: 'BottleDragonBreath',
          177: 'PortalTravel',
          178: 'TridentHit',
          179: 'TridentReturn',
          180: 'TridentRiptide1',
          181: 'TridentRiptide2',
          182: 'TridentRiptide3',
          183: 'TridentThrow',
          184: 'TridentThunder',
          185: 'TridentHitGround',
          186: 'Default',
          187: 'FletchingTableUse',
          188: 'ElemConstructOpen',
          189: 'IceBombHit',
          190: 'BalloonPop',
          191: 'LtReactionIceBomb',
          192: 'LtReactionBleach',
          193: 'LtReactionElephantToothpaste',
          194: 'LtReactionElephantToothpaste2',
          195: 'LtReactionGlowStick',
          196: 'LtReactionGlowStick2',
          197: 'LtReactionLuminol',
          198: 'LtReactionSalt',
          199: 'LtReactionFertilizer',
          200: 'LtReactionFireball',
          201: 'LtReactionMagnesiumSalt',
          202: 'LtReactionMiscFire',
          203: 'LtReactionFire',
          204: 'LtReactionMiscExplosion',
          205: 'LtReactionMiscMystical',
          206: 'LtReactionMiscMystical2',
          207: 'LtReactionProduct',
          208: 'SparklerUse',
          209: 'GlowStickUse',
          210: 'SparklerActive',
          211: 'ConvertToDrowned',
          212: 'BucketFillFish',
          213: 'BucketEmptyFish',
          214: 'BubbleColumnUpwards',
          215: 'BubbleColumnDownwards',
          216: 'BubblePop',
          217: 'BubbleUpInside',
          218: 'BubbleDownInside',
          219: 'HurtBaby',
          220: 'DeathBaby',
          221: 'StepBaby',
          222: 'SpawnBaby',
          223: 'Born',
          224: 'TurtleEggBreak',
          225: 'TurtleEggCrack',
          226: 'TurtleEggHatched',
          227: 'LayEgg',
          228: 'TurtleEggAttacked',
          229: 'BeaconActivate',
          230: 'BeaconAmbient',
          231: 'BeaconDeactivate',
          232: 'BeaconPower',
          233: 'ConduitActivate',
          234: 'ConduitAmbient',
          235: 'ConduitAttack',
          236: 'ConduitDeactivate',
          237: 'ConduitShort',
          238: 'Swoop',
          239: 'BambooSaplingPlace',
          240: 'PreSneeze',
          241: 'Sneeze',
          242: 'AmbientTame',
          243: 'Scared',
          244: 'ScaffoldingClimb',
          245: 'CrossbowLoadingStart',
          246: 'CrossbowLoadingMiddle',
          247: 'CrossbowLoadingEnd',
          248: 'CrossbowShoot',
          249: 'CrossbowQuickChargeStart',
          250: 'CrossbowQuickChargeMiddle',
          251: 'CrossbowQuickChargeEnd',
          252: 'AmbientAggressive',
          253: 'AmbientWorried',
          254: 'CantBreed',
          255: 'ShieldBlock',
          256: 'LecternBookPlace',
          257: 'GrindstoneUse',
          258: 'Bell',
          259: 'CampfireCrackle',
          260: 'Roar',
          261: 'Stun',
          262: 'SweetBerryBushHurt',
          263: 'SweetBerryBushPick',
          264: 'CartographyTableUse',
          265: 'StonecutterUse',
          266: 'ComposterEmpty',
          267: 'ComposterFill',
          268: 'ComposterFillLayer',
          269: 'ComposterReady',
          270: 'BarrelOpen',
          271: 'BarrelClose',
          272: 'RaidHorn',
          273: 'LoomUse',
          274: 'AmbientInRaid',
          275: 'UicartographyTableUse',
          276: 'UistonecutterUse',
          277: 'UiloomUse',
          278: 'SmokerUse',
          279: 'BlastFurnaceUse',
          280: 'SmithingTableUse',
          281: 'Screech',
          282: 'Sleep',
          283: 'FurnaceUse',
          284: 'MooshroomConvert',
          285: 'MilkSuspiciously',
          286: 'Celebrate',
          287: 'JumpPrevent',
          288: 'AmbientPollinate',
          289: 'BeehiveDrip',
          290: 'BeehiveEnter',
          291: 'BeehiveExit',
          292: 'BeehiveWork',
          293: 'BeehiveShear',
          294: 'HoneybottleDrink',
          295: 'AmbientCave',
          296: 'Retreat',
          297: 'ConvertToZombified',
          298: 'Admire',
          299: 'StepLava',
          300: 'Tempt',
          301: 'Panic',
          302: 'Angry',
          303: 'AmbientMoodWarpedForest',
          304: 'AmbientMoodSoulsandValley',
          305: 'AmbientMoodNetherWastes',
          306: 'AmbientMoodBasaltDeltas',
          307: 'AmbientMoodCrimsonForest',
          308: 'RespawnAnchorCharge',
          309: 'RespawnAnchorDeplete',
          310: 'RespawnAnchorSetSpawn',
          311: 'RespawnAnchorAmbient',
          312: 'SoulEscapeQuiet',
          313: 'SoulEscapeLoud',
          314: 'RecordPigstep',
          315: 'LinkCompassToLodestone',
          316: 'UseSmithingTable',
          317: 'EquipNetherite',
          318: 'AmbientLoopWarpedForest',
          319: 'AmbientLoopSoulsandValley',
          320: 'AmbientLoopNetherWastes',
          321: 'AmbientLoopBasaltDeltas',
          322: 'AmbientLoopCrimsonForest',
          323: 'AmbientAdditionWarpedForest',
          324: 'AmbientAdditionSoulsandValley',
          325: 'AmbientAdditionNetherWastes',
          326: 'AmbientAdditionBasaltDeltas',
          327: 'AmbientAdditionCrimsonForest',
          328: 'SculkSensorPowerOn',
          329: 'SculkSensorPowerOff',
          330: 'BucketFillPowderSnow',
          331: 'BucketEmptyPowderSnow',
          332: 'PointedDripstoneCauldronDripWater',
          333: 'PointedDripstoneCauldronDripLava',
          334: 'PointedDripstoneDripWater',
          335: 'PointedDripstoneDripLava',
          336: 'CaveVinesPickBerries',
          337: 'BigDripleafTiltDown',
          338: 'BigDripleafTiltUp',
          339: 'CopperWaxOn',
          340: 'CopperWaxOff',
          341: 'Scrape',
          342: 'PlayerHurtDrown',
          343: 'PlayerHurtOnFire',
          344: 'PlayerHurtFreeze',
          345: 'UseSpyglass',
          346: 'StopUsingSpyglass',
          347: 'AmethystBlockChime',
          348: 'AmbientScreamer',
          349: 'HurtScreamer',
          350: 'DeathScreamer',
          351: 'MilkScreamer',
          352: 'JumpToBlock',
          353: 'PreRam',
          354: 'PreRamScreamer',
          355: 'RamImpact',
          356: 'RamImpactScreamer',
          357: 'SquidInkSquirt',
          358: 'GlowSquidInkSquirt',
          359: 'ConvertToStray',
          360: 'CakeAddCandle',
          361: 'ExtinguishCandle',
          362: 'AmbientCandle',
          363: 'BlockClick',
          364: 'BlockClickFail',
          365: 'SculkCatalystBloom',
          366: 'SculkShriekerShriek',
          367: 'WardenNearbyClose',
          368: 'WardenNearbyCloser',
          369: 'WardenNearbyClosest',
          370: 'WardenSlightlyAngry',
          371: 'RecordOtherside',
          372: 'Tongue',
          373: 'CrackIronGolem',
          374: 'RepairIronGolem',
          375: 'Listening',
          376: 'Heartbeat',
          377: 'HornBreak',
          378: 'SculkPlace',
          379: 'SculkSpread',
          380: 'SculkCharge',
          381: 'SculkSensorPlace',
          382: 'SculkShriekerPlace',
          383: 'goat_call_0',
          384: 'goat_call_1',
          385: 'goat_call_2',
          386: 'goat_call_3',
          387: 'goat_call_4',
          388: 'goat_call_5',
          389: 'goat_call_6',
          390: 'goat_call_7',
          391: 'goat_call_8',
          392: 'goat_call_9',
          393: 'goat_harmony_0',
          394: 'goat_harmony_1',
          395: 'goat_harmony_2',
          396: 'goat_harmony_3',
          397: 'goat_harmony_4',
          398: 'goat_harmony_5',
          399: 'goat_harmony_6',
          400: 'goat_harmony_7',
          401: 'goat_harmony_8',
          402: 'goat_harmony_9',
          403: 'goat_melody_0',
          404: 'goat_melody_1',
          405: 'goat_melody_2',
          406: 'goat_melody_3',
          407: 'goat_melody_4',
          408: 'goat_melody_5',
          409: 'goat_melody_6',
          410: 'goat_melody_7',
          411: 'goat_melody_8',
          412: 'goat_melody_9',
          413: 'goat_bass_0',
          414: 'goat_bass_1',
          415: 'goat_bass_2',
          416: 'goat_bass_3',
          417: 'goat_bass_4',
          418: 'goat_bass_5',
          419: 'goat_bass_6',
          420: 'goat_bass_7',
          421: 'goat_bass_8',
          422: 'goat_bass_9',
          423: '_',
          424: '_',
          425: '_',
          426: 'ImitateWarden',
          427: 'ListeningAngry',
          428: 'ItemGiven',
          429: 'ItemTaken',
          430: 'Disappeared',
          431: 'Reappeared',
          432: 'DrinkMilk',
          433: 'FrogspawnHatched',
          434: 'LaySpawn',
          435: 'FrogspawnBreak',
          436: 'SonicBoom',
          437: 'SonicCharge',
          438: 'SoundeventItemThrown',
          439: 'Record5',
          440: 'ConvertToFrog',
          441: 'RecordPlaying',
          442: 'EnchantingTableUse',
          443: 'StepSand',
          444: 'DashReady',
          445: 'BundleDropContents',
          446: 'BundleInsert',
          447: 'BundleRemoveOne',
          448: 'PressurePlateClickOff',
          449: 'PressurePlateClickOn',
          450: 'ButtonClickOff',
          451: 'ButtonClickOn',
          452: 'DoorOpen',
          453: 'DoorClose',
          454: 'TrapdoorOpen',
          455: 'TrapdoorClose',
          456: 'FenceGateOpen',
          457: 'FenceGateClose',
          458: 'Insert',
          459: 'Pickup',
          460: 'InsertEnchanted',
          461: 'PickupEnchanted',
          462: 'Brush',
          463: 'BrushCompleted',
          464: 'ShatterDecoratedPot',
          465: 'BreakDecoratedPot',
          466: 'SnifferEggCrack',
          467: 'SnifferEggHatched',
          468: 'WaxedSignInteractFail',
          469: 'RecordRelic',
          470: 'Bump',
          471: 'PumpkinCarve',
          472: 'ConvertHuskToZombie',
          473: 'PigDeath',
          474: 'HoglinZombified',
          475: 'AmbientUnderwaterEnter',
          476: 'AmbientUnderwaterExit',
          477: 'bottle_fill',
          478: 'bottle_empty',
          479: 'crafter_craft',
          480: 'crafter_fail',
          481: 'block_decorated_pot_insert',
          482: 'block_decorated_pot_insert_fail',
          483: 'crafter_disable_slot',
          484: 'trial_spawner_open_shutter',
          485: 'trial_spawner_eject_item',
          486: 'trial_spawner_detect_player',
          487: 'trial_spawner_spawn_mob',
          488: 'trial_spawner_close_shutter',
          489: 'trial_spawner_ambient',
          490: 'block_copper_bulb_turn_on',
          491: 'block_copper_bulb_turn_off',
          492: 'ambient_in_air',
          493: 'breeze_wind_charge_burst',
          494: 'imitate_breeze',
          495: 'mob_armadillo_brush',
          496: 'mob_armadillo_scute_drop',
          497: 'armor_equip_wolf',
          498: 'armor_unequip_wolf',
          499: 'reflect',
          500: 'vault_open_shutter',
          501: 'vault_close_shutter',
          502: 'vault_eject_item',
          503: 'vault_insert_item',
          504: 'vault_insert_item_fail',
          505: 'vault_ambient',
          506: 'vault_activate',
          507: 'vault_deactivate',
          508: 'hurt_reduced',
          509: 'wind_charge_burst',
          510: 'imitate_drowned',
          511: 'bundle_insert_failed',
          512: '_',
          513: 'armor_crack_wolf',
          514: 'armor_break_wolf',
          515: 'armor_repair_wolf',
          516: 'mace_smash_air',
          517: 'mace_smash_ground',
          518: 'trail_spawner_charge_activate',
          519: 'trail_spawner_ambient_ominous',
          520: 'ominous_item_spawner_spawn_item',
          521: 'ominous_bottle_end_use',
          522: 'mace_smash_heavy_ground',
          523: 'ominous_item_spawner_spawn_item_begin',
          524: '_',
          525: 'apply_effect_bad_omen',
          526: 'apply_effect_raid_omen',
          527: 'apply_effect_trial_omen',
          528: 'ominous_item_spawner_about_to_spawn_item',
          529: 'record_creator',
          530: 'record_creator_music_box',
          531: 'record_precipice',
        },
      },
    ],
    LegacyEntityType: [
      'mapper',
      {
        type: 'li32',
        mappings: {
          10: 'chicken',
          11: 'cow',
          12: 'pig',
          13: 'sheep',
          14: 'wolf',
          15: 'villager',
          16: 'mooshroom',
          17: 'squid',
          18: 'rabbit',
          19: 'bat',
          20: 'iron_golem',
          21: 'snow_golem',
          22: 'ocelot',
          23: 'horse',
          24: 'donkey',
          25: 'mule',
          26: 'skeleton_horse',
          27: 'zombie_horse',
          28: 'polar_bear',
          29: 'llama',
          30: 'parrot',
          31: 'dolphin',
          32: 'zombie',
          33: 'creeper',
          34: 'skeleton',
          35: 'spider',
          36: 'zombie_pigman',
          37: 'slime',
          38: 'enderman',
          39: 'silverfish',
          40: 'cave_spider',
          41: 'ghast',
          42: 'magma_cube',
          43: 'blaze',
          44: 'zombie_villager',
          45: 'witch',
          46: 'stray',
          47: 'husk',
          48: 'wither_skeleton',
          49: 'guardian',
          50: 'elder_guardian',
          51: 'npc',
          52: 'wither',
          53: 'ender_dragon',
          54: 'shulker',
          55: 'endermite',
          56: 'agent',
          57: 'vindicator',
          58: 'phantom',
          61: 'armor_stand',
          62: 'tripod_camera',
          63: 'player',
          64: 'item',
          65: 'tnt',
          66: 'falling_block',
          67: 'moving_block',
          68: 'xp_bottle',
          69: 'xp_orb',
          70: 'eye_of_ender_signal',
          71: 'ender_crystal',
          72: 'fireworks_rocket',
          73: 'thrown_trident',
          74: 'turtle',
          75: 'cat',
          76: 'shulker_bullet',
          77: 'fishing_hook',
          78: 'chalkboard',
          79: 'dragon_fireball',
          80: 'arrow',
          81: 'snowball',
          82: 'egg',
          83: 'painting',
          84: 'minecart',
          85: 'fireball',
          86: 'splash_potion',
          87: 'ender_pearl',
          88: 'leash_knot',
          89: 'wither_skull',
          90: 'boat',
          91: 'wither_skull_dangerous',
          93: 'lightning_bolt',
          94: 'small_fireball',
          95: 'area_effect_cloud',
          96: 'hopper_minecart',
          97: 'tnt_minecart',
          98: 'chest_minecart',
          100: 'command_block_minecart',
          101: 'lingering_potion',
          102: 'llama_spit',
          103: 'evocation_fang',
          104: 'evocation_illager',
          105: 'vex',
          106: 'ice_bomb',
          107: 'balloon',
          108: 'pufferfish',
          109: 'salmon',
          110: 'drowned',
          111: 'tropicalfish',
          112: 'cod',
          113: 'panda',
        },
      },
    ],
    DeviceOS: [
      'mapper',
      {
        type: 'li32',
        mappings: {
          0: 'Undefined',
          1: 'Android',
          2: 'IOS',
          3: 'OSX',
          4: 'FireOS',
          5: 'GearVR',
          6: 'Hololens',
          7: 'Win10',
          8: 'Win32',
          9: 'Dedicated',
          10: 'TVOS',
          11: 'Orbis',
          12: 'NintendoSwitch',
          13: 'Xbox',
          14: 'WindowsPhone',
          15: 'Linux',
        },
      },
    ],
    AbilitySet: [
      'bitflags',
      {
        type: 'lu32',
        flags: [
          'build',
          'mine',
          'doors_and_switches',
          'open_containers',
          'attack_players',
          'attack_mobs',
          'operator_commands',
          'teleport',
          'invulnerable',
          'flying',
          'may_fly',
          'instant_build',
          'lightning',
          'fly_speed',
          'walk_speed',
          'muted',
          'world_builder',
          'no_clip',
          'privileged_builder',
          'vertical_fly_speed',
          'count',
        ],
      },
    ],
    AbilityLayers: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'lu16',
              mappings: {
                0: 'cache',
                1: 'base',
                2: 'spectator',
                3: 'commands',
                4: 'editor',
                5: 'loading_screen',
              },
            },
          ],
        },
        {
          name: 'allowed',
          type: 'AbilitySet',
        },
        {
          name: 'enabled',
          type: 'AbilitySet',
        },
        {
          name: 'fly_speed',
          type: 'lf32',
        },
        {
          name: 'walk_speed',
          type: 'lf32',
        },
      ],
    ],
    CameraPresets: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'parent',
          type: 'string',
        },
        {
          name: 'position',
          type: 'Vec3fopts',
        },
        {
          name: 'rotation',
          type: 'Vec2fopts',
        },
        {
          name: 'rotation_speed',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'snap_to_target',
          type: [
            'option',
            'bool',
          ],
        },
        {
          name: 'horizontal_rotation_limit',
          type: [
            'option',
            'vec2f',
          ],
        },
        {
          name: 'vertical_rotation_limit',
          type: [
            'option',
            'vec2f',
          ],
        },
        {
          name: 'continue_targeting',
          type: [
            'option',
            'bool',
          ],
        },
        {
          name: 'tracking_radius',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'offset',
          type: [
            'option',
            'vec2f',
          ],
        },
        {
          name: 'entity_offset',
          type: [
            'option',
            'vec3f',
          ],
        },
        {
          name: 'radius',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'yaw_limit_min',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'yaw_limit_max',
          type: [
            'option',
            'lf32',
          ],
        },
        {
          name: 'audio_listener',
          type: [
            'option',
            'u8',
          ],
        },
        {
          name: 'player_effects',
          type: [
            'option',
            'bool',
          ],
        },
        {
          name: 'align_target_and_camera_forward',
          type: [
            'option',
            'bool',
          ],
        },
        {
          name: 'aim_assist',
          type: [
            'option',
            [
              'container',
              [
                {
                  name: 'preset_id',
                  type: [
                    'option',
                    'string',
                  ],
                },
                {
                  name: 'target_mode',
                  type: [
                    'option',
                    [
                      'mapper',
                      {
                        type: 'li32',
                        mappings: {
                          0: 'angle',
                          1: 'distance',
                        },
                      },
                    ],
                  ],
                },
                {
                  name: 'angle',
                  type: [
                    'option',
                    'vec2f',
                  ],
                },
                {
                  name: 'distance',
                  type: [
                    'option',
                    'lf32',
                  ],
                },
              ],
            ],
          ],
        },
      ],
    ],
    DisconnectFailReason: [
      'mapper',
      {
        type: 'zigzag32',
        mappings: {
          0: 'unknown',
          1: 'cant_connect_no_internet',
          2: 'no_permissions',
          3: 'unrecoverable_error',
          4: 'third_party_blocked',
          5: 'third_party_no_internet',
          6: 'third_party_bad_ip',
          7: 'third_party_no_server_or_server_locked',
          8: 'version_mismatch',
          9: 'skin_issue',
          10: 'invite_session_not_found',
          11: 'edu_level_settings_missing',
          12: 'local_server_not_found',
          13: 'legacy_disconnect',
          14: 'user_leave_game_attempted',
          15: 'platform_locked_skins_error',
          16: 'realms_world_unassigned',
          17: 'realms_server_cant_connect',
          18: 'realms_server_hidden',
          19: 'realms_server_disabled_beta',
          20: 'realms_server_disabled',
          21: 'cross_platform_disallowed',
          22: 'cant_connect',
          23: 'session_not_found',
          24: 'client_settings_incompatible_with_server',
          25: 'server_full',
          26: 'invalid_platform_skin',
          27: 'edition_version_mismatch',
          28: 'edition_mismatch',
          29: 'level_newer_than_exe_version',
          30: 'no_fail_occurred',
          31: 'banned_skin',
          32: 'timeout',
          33: 'server_not_found',
          34: 'outdated_server',
          35: 'outdated_client',
          36: 'no_premium_platform',
          37: 'multiplayer_disabled',
          38: 'no_wifi',
          39: 'world_corruption',
          40: 'no_reason',
          41: 'disconnected',
          42: 'invalid_player',
          43: 'logged_in_other_location',
          44: 'server_id_conflict',
          45: 'not_allowed',
          46: 'not_authenticated',
          47: 'invalid_tenant',
          48: 'unknown_packet',
          49: 'unexpected_packet',
          50: 'invalid_command_request_packet',
          51: 'host_suspended',
          52: 'login_packet_no_request',
          53: 'login_packet_no_cert',
          54: 'missing_client',
          55: 'kicked',
          56: 'kicked_for_exploit',
          57: 'kicked_for_idle',
          58: 'resource_pack_problem',
          59: 'incompatible_pack',
          60: 'out_of_storage',
          61: 'invalid_level',
          62: 'disconnect_packet_deprecated',
          63: 'block_mismatch',
          64: 'invalid_heights',
          65: 'invalid_widths',
          66: 'connection_lost',
          67: 'zombie_connection',
          68: 'shutdown',
          69: 'reason_not_set',
          70: 'loading_state_timeout',
          71: 'resource_pack_loading_failed',
          72: 'searching_for_session_loading_screen_failed',
          73: 'conn_protocol_version',
          74: 'subsystem_status_error',
          75: 'empty_auth_from_discovery',
          76: 'empty_url_from_discovery',
          77: 'expired_auth_from_discovery',
          78: 'unknown_signal_service_sign_in_failure',
          79: 'xbl_join_lobby_failure',
          80: 'unspecified_client_instance_disconnection',
          81: 'conn_session_not_found',
          82: 'conn_create_peer_connection',
          83: 'conn_ice',
          84: 'conn_connect_request',
          85: 'conn_connect_response',
          86: 'conn_negotiation_timeout',
          87: 'conn_inactivity_timeout',
          88: 'stale_connection_being_replaced',
          89: 'realms_session_not_found',
          90: 'bad_packet',
          91: 'conn_failed_to_create_offer',
          92: 'conn_failed_to_create_answer',
          93: 'conn_failed_to_set_local_description',
          94: 'conn_failed_to_set_remote_description',
          95: 'conn_negotiation_timeout_waiting_for_response',
          96: 'conn_negotiation_timeout_waiting_for_accept',
          97: 'conn_incoming_connection_ignored',
          98: 'conn_signaling_parsing_failure',
          99: 'conn_signaling_unknown_error',
          100: 'conn_signaling_unicast_delivery_failed',
          101: 'conn_signaling_broadcast_delivery_failed',
          102: 'conn_signaling_generic_delivery_failed',
          103: 'editor_mismatch_editor_world',
          104: 'editor_mismatch_vanilla_world',
          105: 'world_transfer_not_primary_client',
          106: 'server_shutdown',
          107: 'game_setup_cancelled',
          108: 'game_setup_failed',
          109: 'sub_client_login_disabled',
          110: 'deep_link_trying_to_open_demo_world_while_signed_in',
        },
      },
    ],
    FullContainerName: [
      'container',
      [
        {
          name: 'container_id',
          type: 'ContainerSlotType',
        },
        {
          name: 'dynamic_container_id',
          type: [
            'option',
            'u32',
          ],
        },
      ],
    ],
    MovementEffectType: [
      'mapper',
      {
        type: 'varint',
        mappings: {
          '0': 'GLIDE_BOOST',
          '-1': 'invalid',
        },
      },
    ],
    CameraAimAssistAction: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'set_from_camera_preset',
          1: 'clear',
        },
      },
    ],
    EntityBoundingBoxComponent: [
      'container',
      [
        {
          name: 'scale',
          type: 'lf32',
        },
        {
          name: 'width',
          type: 'lf32',
        },
        {
          name: 'height',
          type: 'lf32',
        },
      ],
    ],
    MovementAttributesComponent: [
      'container',
      [
        {
          name: 'movement_speed',
          type: 'lf32',
        },
        {
          name: 'underwater_movement_speed',
          type: 'lf32',
        },
        {
          name: 'lava_movement_speed',
          type: 'lf32',
        },
        {
          name: 'jump_strength',
          type: 'lf32',
        },
        {
          name: 'health',
          type: 'lf32',
        },
        {
          name: 'hunger',
          type: 'lf32',
        },
      ],
    ],
    CreativeItemCategory: [
      'mapper',
      {
        type: 'li32',
        mappings: {
          0: 'all',
          1: 'construction',
          2: 'nature',
          3: 'equipment',
          4: 'items',
          5: 'item_command_only',
          6: 'undefined',
        },
      },
    ],
    mcpe_packet: [
      'container',
      [
        {
          name: 'name',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                1: 'login',
                2: 'play_status',
                3: 'server_to_client_handshake',
                4: 'client_to_server_handshake',
                5: 'disconnect',
                6: 'resource_packs_info',
                7: 'resource_pack_stack',
                8: 'resource_pack_client_response',
                9: 'text',
                10: 'set_time',
                11: 'start_game',
                12: 'add_player',
                13: 'add_entity',
                14: 'remove_entity',
                15: 'add_item_entity',
                16: 'server_post_move',
                17: 'take_item_entity',
                18: 'move_entity',
                19: 'move_player',
                20: 'rider_jump',
                21: 'update_block',
                22: 'add_painting',
                23: 'tick_sync',
                24: 'level_sound_event_old',
                25: 'level_event',
                26: 'block_event',
                27: 'entity_event',
                28: 'mob_effect',
                29: 'update_attributes',
                30: 'inventory_transaction',
                31: 'mob_equipment',
                32: 'mob_armor_equipment',
                33: 'interact',
                34: 'block_pick_request',
                35: 'entity_pick_request',
                36: 'player_action',
                38: 'hurt_armor',
                39: 'set_entity_data',
                40: 'set_entity_motion',
                41: 'set_entity_link',
                42: 'set_health',
                43: 'set_spawn_position',
                44: 'animate',
                45: 'respawn',
                46: 'container_open',
                47: 'container_close',
                48: 'player_hotbar',
                49: 'inventory_content',
                50: 'inventory_slot',
                51: 'container_set_data',
                52: 'crafting_data',
                53: 'crafting_event',
                54: 'gui_data_pick_item',
                55: 'adventure_settings',
                56: 'block_entity_data',
                57: 'player_input',
                58: 'level_chunk',
                59: 'set_commands_enabled',
                60: 'set_difficulty',
                61: 'change_dimension',
                62: 'set_player_game_type',
                63: 'player_list',
                64: 'simple_event',
                65: 'event',
                66: 'spawn_experience_orb',
                67: 'clientbound_map_item_data',
                68: 'map_info_request',
                69: 'request_chunk_radius',
                70: 'chunk_radius_update',
                72: 'game_rules_changed',
                73: 'camera',
                74: 'boss_event',
                75: 'show_credits',
                76: 'available_commands',
                77: 'command_request',
                78: 'command_block_update',
                79: 'command_output',
                80: 'update_trade',
                81: 'update_equipment',
                82: 'resource_pack_data_info',
                83: 'resource_pack_chunk_data',
                84: 'resource_pack_chunk_request',
                85: 'transfer',
                86: 'play_sound',
                87: 'stop_sound',
                88: 'set_title',
                89: 'add_behavior_tree',
                90: 'structure_block_update',
                91: 'show_store_offer',
                92: 'purchase_receipt',
                93: 'player_skin',
                94: 'sub_client_login',
                95: 'initiate_web_socket_connection',
                96: 'set_last_hurt_by',
                97: 'book_edit',
                98: 'npc_request',
                99: 'photo_transfer',
                100: 'modal_form_request',
                101: 'modal_form_response',
                102: 'server_settings_request',
                103: 'server_settings_response',
                104: 'show_profile',
                105: 'set_default_game_type',
                106: 'remove_objective',
                107: 'set_display_objective',
                108: 'set_score',
                109: 'lab_table',
                110: 'update_block_synced',
                111: 'move_entity_delta',
                112: 'set_scoreboard_identity',
                113: 'set_local_player_as_initialized',
                114: 'update_soft_enum',
                115: 'network_stack_latency',
                117: 'script_custom_event',
                118: 'spawn_particle_effect',
                119: 'available_entity_identifiers',
                120: 'level_sound_event_v2',
                121: 'network_chunk_publisher_update',
                122: 'biome_definition_list',
                123: 'level_sound_event',
                124: 'level_event_generic',
                125: 'lectern_update',
                126: 'video_stream_connect',
                129: 'client_cache_status',
                130: 'on_screen_texture_animation',
                131: 'map_create_locked_copy',
                132: 'structure_template_data_export_request',
                133: 'structure_template_data_export_response',
                134: 'update_block_properties',
                135: 'client_cache_blob_status',
                136: 'client_cache_miss_response',
                137: 'education_settings',
                138: 'emote',
                139: 'multiplayer_settings',
                140: 'settings_command',
                141: 'anvil_damage',
                142: 'completed_using_item',
                143: 'network_settings',
                144: 'player_auth_input',
                145: 'creative_content',
                146: 'player_enchant_options',
                147: 'item_stack_request',
                148: 'item_stack_response',
                149: 'player_armor_damage',
                151: 'update_player_game_type',
                152: 'emote_list',
                153: 'position_tracking_db_broadcast',
                154: 'position_tracking_db_request',
                156: 'packet_violation_warning',
                157: 'motion_prediction_hints',
                158: 'animate_entity',
                159: 'camera_shake',
                160: 'player_fog',
                161: 'correct_player_move_prediction',
                162: 'item_registry',
                163: 'filter_text_packet',
                164: 'debug_renderer',
                165: 'sync_entity_property',
                166: 'add_volume_entity',
                167: 'remove_volume_entity',
                168: 'simulation_type',
                169: 'npc_dialogue',
                170: 'edu_uri_resource_packet',
                171: 'create_photo',
                172: 'update_subchunk_blocks',
                173: 'photo_info_request',
                174: 'subchunk',
                175: 'subchunk_request',
                176: 'client_start_item_cooldown',
                177: 'script_message',
                178: 'code_builder_source',
                179: 'ticking_areas_load_status',
                180: 'dimension_data',
                181: 'agent_action',
                182: 'change_mob_property',
                183: 'lesson_progress',
                184: 'request_ability',
                185: 'request_permissions',
                186: 'toast_request',
                187: 'update_abilities',
                188: 'update_adventure_settings',
                189: 'death_info',
                190: 'editor_network',
                191: 'feature_registry',
                192: 'server_stats',
                193: 'request_network_settings',
                194: 'game_test_request',
                195: 'game_test_results',
                196: 'update_client_input_locks',
                197: 'client_cheat_ability',
                198: 'camera_presets',
                199: 'unlocked_recipes',
                300: 'camera_instruction',
                301: 'compressed_biome_definitions',
                302: 'trim_data',
                303: 'open_sign',
                304: 'agent_animation',
                305: 'refresh_entitlements',
                306: 'toggle_crafter_slot_request',
                307: 'set_player_inventory_options',
                308: 'set_hud',
                309: 'award_achievement',
                310: 'clientbound_close_form',
                312: 'serverbound_loading_screen',
                313: 'jigsaw_structure_data',
                314: 'current_structure_feature',
                315: 'serverbound_diagnostics',
                316: 'camera_aim_assist',
                317: 'container_registry_cleanup',
                318: 'movement_effect',
                319: 'set_movement_authority',
                320: 'camera_aim_assist_presets',
                321: 'client_camera_aim_assist',
                322: 'client_movement_prediction_sync',
              },
            },
          ],
        },
        {
          name: 'params',
          type: [
            'switch',
            {
              compareTo: 'name',
              fields: {
                login: 'packet_login',
                play_status: 'packet_play_status',
                server_to_client_handshake: 'packet_server_to_client_handshake',
                client_to_server_handshake: 'packet_client_to_server_handshake',
                disconnect: 'packet_disconnect',
                resource_packs_info: 'packet_resource_packs_info',
                resource_pack_stack: 'packet_resource_pack_stack',
                resource_pack_client_response: 'packet_resource_pack_client_response',
                text: 'packet_text',
                set_time: 'packet_set_time',
                start_game: 'packet_start_game',
                add_player: 'packet_add_player',
                add_entity: 'packet_add_entity',
                remove_entity: 'packet_remove_entity',
                add_item_entity: 'packet_add_item_entity',
                take_item_entity: 'packet_take_item_entity',
                move_entity: 'packet_move_entity',
                move_player: 'packet_move_player',
                rider_jump: 'packet_rider_jump',
                update_block: 'packet_update_block',
                add_painting: 'packet_add_painting',
                tick_sync: 'packet_tick_sync',
                level_sound_event_old: 'packet_level_sound_event_old',
                level_event: 'packet_level_event',
                block_event: 'packet_block_event',
                entity_event: 'packet_entity_event',
                mob_effect: 'packet_mob_effect',
                update_attributes: 'packet_update_attributes',
                inventory_transaction: 'packet_inventory_transaction',
                mob_equipment: 'packet_mob_equipment',
                mob_armor_equipment: 'packet_mob_armor_equipment',
                interact: 'packet_interact',
                block_pick_request: 'packet_block_pick_request',
                entity_pick_request: 'packet_entity_pick_request',
                player_action: 'packet_player_action',
                hurt_armor: 'packet_hurt_armor',
                set_entity_data: 'packet_set_entity_data',
                set_entity_motion: 'packet_set_entity_motion',
                set_entity_link: 'packet_set_entity_link',
                set_health: 'packet_set_health',
                set_spawn_position: 'packet_set_spawn_position',
                animate: 'packet_animate',
                respawn: 'packet_respawn',
                container_open: 'packet_container_open',
                container_close: 'packet_container_close',
                player_hotbar: 'packet_player_hotbar',
                inventory_content: 'packet_inventory_content',
                inventory_slot: 'packet_inventory_slot',
                container_set_data: 'packet_container_set_data',
                crafting_data: 'packet_crafting_data',
                crafting_event: 'packet_crafting_event',
                gui_data_pick_item: 'packet_gui_data_pick_item',
                adventure_settings: 'packet_adventure_settings',
                block_entity_data: 'packet_block_entity_data',
                player_input: 'packet_player_input',
                level_chunk: 'packet_level_chunk',
                set_commands_enabled: 'packet_set_commands_enabled',
                set_difficulty: 'packet_set_difficulty',
                change_dimension: 'packet_change_dimension',
                set_player_game_type: 'packet_set_player_game_type',
                player_list: 'packet_player_list',
                simple_event: 'packet_simple_event',
                event: 'packet_event',
                spawn_experience_orb: 'packet_spawn_experience_orb',
                clientbound_map_item_data: 'packet_clientbound_map_item_data',
                map_info_request: 'packet_map_info_request',
                request_chunk_radius: 'packet_request_chunk_radius',
                chunk_radius_update: 'packet_chunk_radius_update',
                game_rules_changed: 'packet_game_rules_changed',
                camera: 'packet_camera',
                boss_event: 'packet_boss_event',
                show_credits: 'packet_show_credits',
                available_commands: 'packet_available_commands',
                command_request: 'packet_command_request',
                command_block_update: 'packet_command_block_update',
                command_output: 'packet_command_output',
                update_trade: 'packet_update_trade',
                update_equipment: 'packet_update_equipment',
                resource_pack_data_info: 'packet_resource_pack_data_info',
                resource_pack_chunk_data: 'packet_resource_pack_chunk_data',
                resource_pack_chunk_request: 'packet_resource_pack_chunk_request',
                transfer: 'packet_transfer',
                play_sound: 'packet_play_sound',
                stop_sound: 'packet_stop_sound',
                set_title: 'packet_set_title',
                add_behavior_tree: 'packet_add_behavior_tree',
                structure_block_update: 'packet_structure_block_update',
                show_store_offer: 'packet_show_store_offer',
                purchase_receipt: 'packet_purchase_receipt',
                player_skin: 'packet_player_skin',
                sub_client_login: 'packet_sub_client_login',
                initiate_web_socket_connection: 'packet_initiate_web_socket_connection',
                set_last_hurt_by: 'packet_set_last_hurt_by',
                book_edit: 'packet_book_edit',
                npc_request: 'packet_npc_request',
                photo_transfer: 'packet_photo_transfer',
                modal_form_request: 'packet_modal_form_request',
                modal_form_response: 'packet_modal_form_response',
                server_settings_request: 'packet_server_settings_request',
                server_settings_response: 'packet_server_settings_response',
                show_profile: 'packet_show_profile',
                set_default_game_type: 'packet_set_default_game_type',
                remove_objective: 'packet_remove_objective',
                set_display_objective: 'packet_set_display_objective',
                set_score: 'packet_set_score',
                lab_table: 'packet_lab_table',
                update_block_synced: 'packet_update_block_synced',
                move_entity_delta: 'packet_move_entity_delta',
                set_scoreboard_identity: 'packet_set_scoreboard_identity',
                set_local_player_as_initialized: 'packet_set_local_player_as_initialized',
                update_soft_enum: 'packet_update_soft_enum',
                network_stack_latency: 'packet_network_stack_latency',
                script_custom_event: 'packet_script_custom_event',
                spawn_particle_effect: 'packet_spawn_particle_effect',
                available_entity_identifiers: 'packet_available_entity_identifiers',
                level_sound_event_v2: 'packet_level_sound_event_v2',
                network_chunk_publisher_update: 'packet_network_chunk_publisher_update',
                biome_definition_list: 'packet_biome_definition_list',
                level_sound_event: 'packet_level_sound_event',
                level_event_generic: 'packet_level_event_generic',
                lectern_update: 'packet_lectern_update',
                video_stream_connect: 'packet_video_stream_connect',
                client_cache_status: 'packet_client_cache_status',
                on_screen_texture_animation: 'packet_on_screen_texture_animation',
                map_create_locked_copy: 'packet_map_create_locked_copy',
                structure_template_data_export_request: 'packet_structure_template_data_export_request',
                structure_template_data_export_response: 'packet_structure_template_data_export_response',
                update_block_properties: 'packet_update_block_properties',
                client_cache_blob_status: 'packet_client_cache_blob_status',
                client_cache_miss_response: 'packet_client_cache_miss_response',
                education_settings: 'packet_education_settings',
                emote: 'packet_emote',
                multiplayer_settings: 'packet_multiplayer_settings',
                settings_command: 'packet_settings_command',
                anvil_damage: 'packet_anvil_damage',
                completed_using_item: 'packet_completed_using_item',
                network_settings: 'packet_network_settings',
                player_auth_input: 'packet_player_auth_input',
                creative_content: 'packet_creative_content',
                player_enchant_options: 'packet_player_enchant_options',
                item_stack_request: 'packet_item_stack_request',
                item_stack_response: 'packet_item_stack_response',
                player_armor_damage: 'packet_player_armor_damage',
                update_player_game_type: 'packet_update_player_game_type',
                emote_list: 'packet_emote_list',
                position_tracking_db_request: 'packet_position_tracking_db_request',
                position_tracking_db_broadcast: 'packet_position_tracking_db_broadcast',
                packet_violation_warning: 'packet_packet_violation_warning',
                motion_prediction_hints: 'packet_motion_prediction_hints',
                animate_entity: 'packet_animate_entity',
                camera_shake: 'packet_camera_shake',
                player_fog: 'packet_player_fog',
                correct_player_move_prediction: 'packet_correct_player_move_prediction',
                item_registry: 'packet_item_registry',
                filter_text_packet: 'packet_filter_text_packet',
                debug_renderer: 'packet_debug_renderer',
                sync_entity_property: 'packet_sync_entity_property',
                add_volume_entity: 'packet_add_volume_entity',
                remove_volume_entity: 'packet_remove_volume_entity',
                simulation_type: 'packet_simulation_type',
                npc_dialogue: 'packet_npc_dialogue',
                edu_uri_resource_packet: 'packet_edu_uri_resource_packet',
                create_photo: 'packet_create_photo',
                update_subchunk_blocks: 'packet_update_subchunk_blocks',
                photo_info_request: 'packet_photo_info_request',
                subchunk: 'packet_subchunk',
                subchunk_request: 'packet_subchunk_request',
                client_start_item_cooldown: 'packet_client_start_item_cooldown',
                script_message: 'packet_script_message',
                code_builder_source: 'packet_code_builder_source',
                ticking_areas_load_status: 'packet_ticking_areas_load_status',
                dimension_data: 'packet_dimension_data',
                agent_action: 'packet_agent_action',
                change_mob_property: 'packet_change_mob_property',
                lesson_progress: 'packet_lesson_progress',
                request_ability: 'packet_request_ability',
                request_permissions: 'packet_request_permissions',
                toast_request: 'packet_toast_request',
                update_abilities: 'packet_update_abilities',
                update_adventure_settings: 'packet_update_adventure_settings',
                death_info: 'packet_death_info',
                editor_network: 'packet_editor_network',
                feature_registry: 'packet_feature_registry',
                server_stats: 'packet_server_stats',
                request_network_settings: 'packet_request_network_settings',
                game_test_request: 'packet_game_test_request',
                game_test_results: 'packet_game_test_results',
                update_client_input_locks: 'packet_update_client_input_locks',
                client_cheat_ability: 'packet_client_cheat_ability',
                camera_presets: 'packet_camera_presets',
                unlocked_recipes: 'packet_unlocked_recipes',
                camera_instruction: 'packet_camera_instruction',
                compressed_biome_definitions: 'packet_compressed_biome_definitions',
                trim_data: 'packet_trim_data',
                open_sign: 'packet_open_sign',
                agent_animation: 'packet_agent_animation',
                refresh_entitlements: 'packet_refresh_entitlements',
                toggle_crafter_slot_request: 'packet_toggle_crafter_slot_request',
                set_player_inventory_options: 'packet_set_player_inventory_options',
                set_hud: 'packet_set_hud',
                award_achievement: 'packet_award_achievement',
                server_post_move: 'packet_server_post_move',
                clientbound_close_form: 'packet_clientbound_close_form',
                serverbound_loading_screen: 'packet_serverbound_loading_screen',
                jigsaw_structure_data: 'packet_jigsaw_structure_data',
                current_structure_feature: 'packet_current_structure_feature',
                serverbound_diagnostics: 'packet_serverbound_diagnostics',
                camera_aim_assist: 'packet_camera_aim_assist',
                container_registry_cleanup: 'packet_container_registry_cleanup',
                movement_effect: 'packet_movement_effect',
                set_movement_authority: 'packet_set_movement_authority',
                camera_aim_assist_presets: 'packet_camera_aim_assist_presets',
                client_camera_aim_assist: 'packet_client_camera_aim_assist',
                client_movement_prediction_sync: 'packet_client_movement_prediction_sync',
              },
            },
          ],
        },
      ],
    ],
    packet_login: [
      'container',
      [
        {
          name: 'protocol_version',
          type: 'i32',
        },
        {
          name: 'tokens',
          type: [
            'encapsulated',
            {
              lengthType: 'varint',
              type: 'LoginTokens',
            },
          ],
        },
      ],
    ],
    LoginTokens: [
      'container',
      [
        {
          name: 'identity',
          type: 'LittleString',
        },
        {
          name: 'client',
          type: 'LittleString',
        },
      ],
    ],
    packet_play_status: [
      'container',
      [
        {
          name: 'status',
          type: [
            'mapper',
            {
              type: 'i32',
              mappings: {
                0: 'login_success',
                1: 'failed_client',
                2: 'failed_spawn',
                3: 'player_spawn',
                4: 'failed_invalid_tenant',
                5: 'failed_vanilla_edu',
                6: 'failed_edu_vanilla',
                7: 'failed_server_full',
                8: 'failed_editor_vanilla_mismatch',
                9: 'failed_vanilla_editor_mismatch',
              },
            },
          ],
        },
      ],
    ],
    packet_server_to_client_handshake: [
      'container',
      [
        {
          name: 'token',
          type: 'string',
        },
      ],
    ],
    packet_client_to_server_handshake: [
      'container',
      [],
    ],
    packet_disconnect: [
      'container',
      [
        {
          name: 'reason',
          type: 'DisconnectFailReason',
        },
        {
          name: 'hide_disconnect_reason',
          type: 'bool',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'hide_disconnect_reason',
              fields: {
                true: 'void',
              },
              default: [
                'container',
                [
                  {
                    name: 'message',
                    type: 'string',
                  },
                  {
                    name: 'filtered_message',
                    type: 'string',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_resource_packs_info: [
      'container',
      [
        {
          name: 'must_accept',
          type: 'bool',
        },
        {
          name: 'has_addons',
          type: 'bool',
        },
        {
          name: 'has_scripts',
          type: 'bool',
        },
        {
          name: 'world_template',
          type: [
            'container',
            [
              {
                name: 'uuid',
                type: 'uuid',
              },
              {
                name: 'version',
                type: 'string',
              },
            ],
          ],
        },
        {
          name: 'texture_packs',
          type: 'TexturePackInfos',
        },
      ],
    ],
    packet_resource_pack_stack: [
      'container',
      [
        {
          name: 'must_accept',
          type: 'bool',
        },
        {
          name: 'behavior_packs',
          type: 'ResourcePackIdVersions',
        },
        {
          name: 'resource_packs',
          type: 'ResourcePackIdVersions',
        },
        {
          name: 'game_version',
          type: 'string',
        },
        {
          name: 'experiments',
          type: 'Experiments',
        },
        {
          name: 'experiments_previously_used',
          type: 'bool',
        },
        {
          name: 'has_editor_packs',
          type: 'bool',
        },
      ],
    ],
    packet_resource_pack_client_response: [
      'container',
      [
        {
          name: 'response_status',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'refused',
                2: 'send_packs',
                3: 'have_all_packs',
                4: 'completed',
              },
            },
          ],
        },
        {
          name: 'resourcepackids',
          type: 'ResourcePackIds',
        },
      ],
    ],
    packet_text: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'raw',
                1: 'chat',
                2: 'translation',
                3: 'popup',
                4: 'jukebox_popup',
                5: 'tip',
                6: 'system',
                7: 'whisper',
                8: 'announcement',
                9: 'json_whisper',
                10: 'json',
                11: 'json_announcement',
              },
            },
          ],
        },
        {
          name: 'needs_translation',
          type: 'bool',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                chat: [
                  'container',
                  [
                    {
                      name: 'source_name',
                      type: 'string',
                    },
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                whisper: [
                  'container',
                  [
                    {
                      name: 'source_name',
                      type: 'string',
                    },
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                announcement: [
                  'container',
                  [
                    {
                      name: 'source_name',
                      type: 'string',
                    },
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                raw: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                tip: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                system: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                json_whisper: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                json: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                json_announcement: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                  ],
                ],
                translation: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                    {
                      name: 'parameters',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'string',
                        },
                      ],
                    },
                  ],
                ],
                popup: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                    {
                      name: 'parameters',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'string',
                        },
                      ],
                    },
                  ],
                ],
                jukebox_popup: [
                  'container',
                  [
                    {
                      name: 'message',
                      type: 'string',
                    },
                    {
                      name: 'parameters',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'string',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'xuid',
          type: 'string',
        },
        {
          name: 'platform_chat_id',
          type: 'string',
        },
        {
          name: 'filtered_message',
          type: 'string',
        },
      ],
    ],
    packet_set_time: [
      'container',
      [
        {
          name: 'time',
          type: 'zigzag32',
        },
      ],
    ],
    packet_start_game: [
      'container',
      [
        {
          name: 'entity_id',
          type: 'zigzag64',
        },
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'player_gamemode',
          type: 'GameMode',
        },
        {
          name: 'player_position',
          type: 'vec3f',
        },
        {
          name: 'rotation',
          type: 'vec2f',
        },
        {
          name: 'seed',
          type: 'lu64',
        },
        {
          name: 'biome_type',
          type: 'li16',
        },
        {
          name: 'biome_name',
          type: 'string',
        },
        {
          name: 'dimension',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'overworld',
                1: 'nether',
                2: 'end',
              },
            },
          ],
        },
        {
          name: 'generator',
          type: 'zigzag32',
        },
        {
          name: 'world_gamemode',
          type: 'GameMode',
        },
        {
          name: 'hardcore',
          type: 'bool',
        },
        {
          name: 'difficulty',
          type: 'zigzag32',
        },
        {
          name: 'spawn_position',
          type: 'BlockCoordinates',
        },
        {
          name: 'achievements_disabled',
          type: 'bool',
        },
        {
          name: 'editor_world_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'not_editor',
                1: 'project',
                2: 'test_level',
              },
            },
          ],
        },
        {
          name: 'created_in_editor',
          type: 'bool',
        },
        {
          name: 'exported_from_editor',
          type: 'bool',
        },
        {
          name: 'day_cycle_stop_time',
          type: 'zigzag32',
        },
        {
          name: 'edu_offer',
          type: 'zigzag32',
        },
        {
          name: 'edu_features_enabled',
          type: 'bool',
        },
        {
          name: 'edu_product_uuid',
          type: 'string',
        },
        {
          name: 'rain_level',
          type: 'lf32',
        },
        {
          name: 'lightning_level',
          type: 'lf32',
        },
        {
          name: 'has_confirmed_platform_locked_content',
          type: 'bool',
        },
        {
          name: 'is_multiplayer',
          type: 'bool',
        },
        {
          name: 'broadcast_to_lan',
          type: 'bool',
        },
        {
          name: 'xbox_live_broadcast_mode',
          type: 'varint',
        },
        {
          name: 'platform_broadcast_mode',
          type: 'varint',
        },
        {
          name: 'enable_commands',
          type: 'bool',
        },
        {
          name: 'is_texturepacks_required',
          type: 'bool',
        },
        {
          name: 'gamerules',
          type: 'GameRules',
        },
        {
          name: 'experiments',
          type: 'Experiments',
        },
        {
          name: 'experiments_previously_used',
          type: 'bool',
        },
        {
          name: 'bonus_chest',
          type: 'bool',
        },
        {
          name: 'map_enabled',
          type: 'bool',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'server_chunk_tick_range',
          type: 'li32',
        },
        {
          name: 'has_locked_behavior_pack',
          type: 'bool',
        },
        {
          name: 'has_locked_resource_pack',
          type: 'bool',
        },
        {
          name: 'is_from_locked_world_template',
          type: 'bool',
        },
        {
          name: 'msa_gamertags_only',
          type: 'bool',
        },
        {
          name: 'is_from_world_template',
          type: 'bool',
        },
        {
          name: 'is_world_template_option_locked',
          type: 'bool',
        },
        {
          name: 'only_spawn_v1_villagers',
          type: 'bool',
        },
        {
          name: 'persona_disabled',
          type: 'bool',
        },
        {
          name: 'custom_skins_disabled',
          type: 'bool',
        },
        {
          name: 'emote_chat_muted',
          type: 'bool',
        },
        {
          name: 'game_version',
          type: 'string',
        },
        {
          name: 'limited_world_width',
          type: 'li32',
        },
        {
          name: 'limited_world_length',
          type: 'li32',
        },
        {
          name: 'is_new_nether',
          type: 'bool',
        },
        {
          name: 'edu_resource_uri',
          type: 'EducationSharedResourceURI',
        },
        {
          name: 'experimental_gameplay_override',
          type: 'bool',
        },
        {
          name: 'chat_restriction_level',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'dropped',
                2: 'disabled',
              },
            },
          ],
        },
        {
          name: 'disable_player_interactions',
          type: 'bool',
        },
        {
          name: 'server_identifier',
          type: 'string',
        },
        {
          name: 'world_identifier',
          type: 'string',
        },
        {
          name: 'scenario_identifier',
          type: 'string',
        },
        {
          name: 'level_id',
          type: 'string',
        },
        {
          name: 'world_name',
          type: 'string',
        },
        {
          name: 'premium_world_template_id',
          type: 'string',
        },
        {
          name: 'is_trial',
          type: 'bool',
        },
        {
          name: 'movement_authority',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'client',
                1: 'server',
                2: 'server_with_rewind',
              },
            },
          ],
        },
        {
          name: 'rewind_history_size',
          type: 'zigzag32',
        },
        {
          name: 'server_authoritative_block_breaking',
          type: 'bool',
        },
        {
          name: 'current_tick',
          type: 'li64',
        },
        {
          name: 'enchantment_seed',
          type: 'zigzag32',
        },
        {
          name: 'block_properties',
          type: 'BlockProperties',
        },
        {
          name: 'multiplayer_correlation_id',
          type: 'string',
        },
        {
          name: 'server_authoritative_inventory',
          type: 'bool',
        },
        {
          name: 'engine',
          type: 'string',
        },
        {
          name: 'property_data',
          type: 'nbt',
        },
        {
          name: 'block_pallette_checksum',
          type: 'lu64',
        },
        {
          name: 'world_template_id',
          type: 'uuid',
        },
        {
          name: 'client_side_generation',
          type: 'bool',
        },
        {
          name: 'block_network_ids_are_hashes',
          type: 'bool',
        },
        {
          name: 'server_controlled_sound',
          type: 'bool',
        },
      ],
    ],
    packet_add_player: [
      'container',
      [
        {
          name: 'uuid',
          type: 'uuid',
        },
        {
          name: 'username',
          type: 'string',
        },
        {
          name: 'runtime_id',
          type: 'varint64',
        },
        {
          name: 'platform_chat_id',
          type: 'string',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'velocity',
          type: 'vec3f',
        },
        {
          name: 'pitch',
          type: 'lf32',
        },
        {
          name: 'yaw',
          type: 'lf32',
        },
        {
          name: 'head_yaw',
          type: 'lf32',
        },
        {
          name: 'held_item',
          type: 'Item',
        },
        {
          name: 'gamemode',
          type: 'GameMode',
        },
        {
          name: 'metadata',
          type: 'MetadataDictionary',
        },
        {
          name: 'properties',
          type: 'EntityProperties',
        },
        {
          name: 'unique_id',
          type: 'li64',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'command_permission',
          type: 'CommandPermissionLevel',
        },
        {
          name: 'abilities',
          type: [
            'array',
            {
              countType: 'u8',
              type: 'AbilityLayers',
            },
          ],
        },
        {
          name: 'links',
          type: 'Links',
        },
        {
          name: 'device_id',
          type: 'string',
        },
        {
          name: 'device_os',
          type: 'DeviceOS',
        },
      ],
    ],
    packet_add_entity: [
      'container',
      [
        {
          name: 'unique_id',
          type: 'zigzag64',
        },
        {
          name: 'runtime_id',
          type: 'varint64',
        },
        {
          name: 'entity_type',
          type: 'string',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'velocity',
          type: 'vec3f',
        },
        {
          name: 'pitch',
          type: 'lf32',
        },
        {
          name: 'yaw',
          type: 'lf32',
        },
        {
          name: 'head_yaw',
          type: 'lf32',
        },
        {
          name: 'body_yaw',
          type: 'lf32',
        },
        {
          name: 'attributes',
          type: 'EntityAttributes',
        },
        {
          name: 'metadata',
          type: 'MetadataDictionary',
        },
        {
          name: 'properties',
          type: 'EntityProperties',
        },
        {
          name: 'links',
          type: 'Links',
        },
      ],
    ],
    packet_remove_entity: [
      'container',
      [
        {
          name: 'entity_id_self',
          type: 'zigzag64',
        },
      ],
    ],
    packet_add_item_entity: [
      'container',
      [
        {
          name: 'entity_id_self',
          type: 'zigzag64',
        },
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'item',
          type: 'Item',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'velocity',
          type: 'vec3f',
        },
        {
          name: 'metadata',
          type: 'MetadataDictionary',
        },
        {
          name: 'is_from_fishing',
          type: 'bool',
        },
      ],
    ],
    packet_take_item_entity: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'target',
          type: 'varint',
        },
      ],
    ],
    packet_move_entity: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'flags',
          type: 'u8',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'rotation',
          type: 'Rotation',
        },
      ],
    ],
    packet_move_player: [
      'container',
      [
        {
          name: 'runtime_id',
          type: 'varint',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'pitch',
          type: 'lf32',
        },
        {
          name: 'yaw',
          type: 'lf32',
        },
        {
          name: 'head_yaw',
          type: 'lf32',
        },
        {
          name: 'mode',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'normal',
                1: 'reset',
                2: 'teleport',
                3: 'rotation',
              },
            },
          ],
        },
        {
          name: 'on_ground',
          type: 'bool',
        },
        {
          name: 'ridden_runtime_id',
          type: 'varint',
        },
        {
          name: 'teleport',
          type: [
            'switch',
            {
              compareTo: 'mode',
              fields: {
                teleport: [
                  'container',
                  [
                    {
                      name: 'cause',
                      type: [
                        'mapper',
                        {
                          type: 'li32',
                          mappings: {
                            0: 'unknown',
                            1: 'projectile',
                            2: 'chorus_fruit',
                            3: 'command',
                            4: 'behavior',
                          },
                        },
                      ],
                    },
                    {
                      name: 'source_entity_type',
                      type: 'LegacyEntityType',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_rider_jump: [
      'container',
      [
        {
          name: 'jump_strength',
          type: 'zigzag32',
        },
      ],
    ],
    packet_update_block: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'block_runtime_id',
          type: 'varint',
        },
        {
          name: 'flags',
          type: 'UpdateBlockFlags',
        },
        {
          name: 'layer',
          type: 'varint',
        },
      ],
    ],
    UpdateBlockFlags: [
      'bitflags',
      {
        type: 'varint',
        flags: {
          neighbors: 1,
          network: 2,
          no_graphic: 4,
          unused: 8,
          priority: 16,
        },
      },
    ],
    packet_add_painting: [
      'container',
      [
        {
          name: 'entity_id_self',
          type: 'zigzag64',
        },
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'coordinates',
          type: 'vec3f',
        },
        {
          name: 'direction',
          type: 'zigzag32',
        },
        {
          name: 'title',
          type: 'string',
        },
      ],
    ],
    packet_tick_sync: [
      'container',
      [
        {
          name: 'request_time',
          type: 'li64',
        },
        {
          name: 'response_time',
          type: 'li64',
        },
      ],
    ],
    packet_level_sound_event_old: [
      'container',
      [
        {
          name: 'sound_id',
          type: 'u8',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'block_id',
          type: 'zigzag32',
        },
        {
          name: 'entity_type',
          type: 'zigzag32',
        },
        {
          name: 'is_baby_mob',
          type: 'bool',
        },
        {
          name: 'is_global',
          type: 'bool',
        },
      ],
    ],
    packet_level_event: [
      'container',
      [
        {
          name: 'event',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                1000: 'sound_click',
                1001: 'sound_click_fail',
                1002: 'sound_shoot',
                1003: 'sound_door',
                1004: 'sound_fizz',
                1005: 'sound_ignite',
                1007: 'sound_ghast',
                1008: 'sound_ghast_shoot',
                1009: 'sound_blaze_shoot',
                1010: 'sound_door_bump',
                1012: 'sound_door_crash',
                1018: 'sound_enderman_teleport',
                1020: 'sound_anvil_break',
                1021: 'sound_anvil_use',
                1022: 'sound_anvil_fall',
                1030: 'sound_pop',
                1032: 'sound_portal',
                1040: 'sound_itemframe_add_item',
                1041: 'sound_itemframe_remove',
                1042: 'sound_itemframe_place',
                1043: 'sound_itemframe_remove_item',
                1044: 'sound_itemframe_rotate_item',
                1050: 'sound_camera',
                1051: 'sound_orb',
                1052: 'sound_totem',
                1060: 'sound_armor_stand_break',
                1061: 'sound_armor_stand_hit',
                1062: 'sound_armor_stand_fall',
                1063: 'sound_armor_stand_place',
                1064: 'pointed_dripstone_land',
                1065: 'dye_used',
                1066: 'ink_sack_used',
                2000: 'particle_shoot',
                2001: 'particle_destroy',
                2002: 'particle_splash',
                2003: 'particle_eye_despawn',
                2004: 'particle_spawn',
                2005: 'particle_crop_growth',
                2006: 'particle_guardian_curse',
                2007: 'particle_death_smoke',
                2008: 'particle_block_force_field',
                2009: 'particle_projectile_hit',
                2010: 'particle_dragon_egg_teleport',
                2011: 'particle_crop_eaten',
                2012: 'particle_critical',
                2013: 'particle_enderman_teleport',
                2014: 'particle_punch_block',
                2015: 'particle_bubble',
                2016: 'particle_evaporate',
                2017: 'particle_destroy_armor_stand',
                2018: 'particle_breaking_egg',
                2019: 'particle_destroy_egg',
                2020: 'particle_evaporate_water',
                2021: 'particle_destroy_block_no_sound',
                2022: 'particle_knockback_roar',
                2023: 'particle_teleport_trail',
                2024: 'particle_point_cloud',
                2025: 'particle_explosion',
                2026: 'particle_block_explosion',
                2027: 'particle_vibration_signal',
                2028: 'particle_dripstone_drip',
                2029: 'particle_fizz_effect',
                2030: 'particle_wax_on',
                2031: 'particle_wax_off',
                2032: 'particle_scrape',
                2033: 'particle_electric_spark',
                2034: 'particle_turtle_egg',
                2035: 'particle_sculk_shriek',
                2036: 'sculk_catalyst_bloom',
                2037: 'sculk_charge',
                2038: 'sculk_charge_pop',
                2039: 'sonic_explosion',
                2040: 'dust_plume',
                3001: 'start_rain',
                3002: 'start_thunder',
                3003: 'stop_rain',
                3004: 'stop_thunder',
                3005: 'pause_game',
                3006: 'pause_game_no_screen',
                3007: 'set_game_speed',
                3500: 'redstone_trigger',
                3501: 'cauldron_explode',
                3502: 'cauldron_dye_armor',
                3503: 'cauldron_clean_armor',
                3504: 'cauldron_fill_potion',
                3505: 'cauldron_take_potion',
                3506: 'cauldron_fill_water',
                3507: 'cauldron_take_water',
                3508: 'cauldron_add_dye',
                3509: 'cauldron_clean_banner',
                3600: 'block_start_break',
                3601: 'block_stop_break',
                3602: 'block_break_speed',
                3603: 'particle_punch_block_down',
                3604: 'particle_punch_block_up',
                3605: 'particle_punch_block_north',
                3606: 'particle_punch_block_south',
                3607: 'particle_punch_block_west',
                3608: 'particle_punch_block_east',
                3609: 'particle_shoot_white_smoke',
                3610: 'particle_breeze_wind_explosion',
                3611: 'particle_trial_spawner_detection',
                3612: 'particle_trial_spawner_spawning',
                3613: 'particle_trial_spawner_ejecting',
                3614: 'particle_wind_explosion',
                3615: 'particle_wolf_armor_break',
                4000: 'set_data',
                9800: 'players_sleeping',
                9801: 'sleeping_players',
                9810: 'jump_prevented',
                9811: 'animation_vault_activate',
                9812: 'animation_vault_deactivate',
                9813: 'animation_vault_eject_item',
                9814: 'animation_spawn_cobweb',
                9815: 'add_particle_smash_attack_ground_dust',
                9816: 'add_particle_creaking_heart_trail',
                16384: 'add_particle_mask',
                16385: 'add_particle_bubble',
                16386: 'add_particle_bubble_manual',
                16387: 'add_particle_critical',
                16388: 'add_particle_block_force_field',
                16389: 'add_particle_smoke',
                16390: 'add_particle_explode',
                16391: 'add_particle_evaporation',
                16392: 'add_particle_flame',
                16393: 'add_particle_candle_flame',
                16394: 'add_particle_lava',
                16395: 'add_particle_large_smoke',
                16396: 'add_particle_redstone',
                16397: 'add_particle_rising_red_dust',
                16398: 'add_particle_item_break',
                16399: 'add_particle_snowball_poof',
                16400: 'add_particle_huge_explode',
                16401: 'add_particle_huge_explode_seed',
                16402: 'add_particle_mob_flame',
                16403: 'add_particle_heart',
                16404: 'add_particle_terrain',
                16405: 'add_particle_town_aura',
                16406: 'add_particle_portal',
                16408: 'add_particle_water_splash',
                16409: 'add_particle_water_splash_manual',
                16410: 'add_particle_water_wake',
                16411: 'add_particle_drip_water',
                16412: 'add_particle_drip_lava',
                16413: 'add_particle_drip_honey',
                16414: 'add_particle_stalactite_drip_water',
                16415: 'add_particle_stalactite_drip_lava',
                16416: 'add_particle_falling_dust',
                16417: 'add_particle_mob_spell',
                16418: 'add_particle_mob_spell_ambient',
                16419: 'add_particle_mob_spell_instantaneous',
                16420: 'add_particle_ink',
                16421: 'add_particle_slime',
                16422: 'add_particle_rain_splash',
                16423: 'add_particle_villager_angry',
                16424: 'add_particle_villager_happy',
                16425: 'add_particle_enchantment_table',
                16426: 'add_particle_tracking_emitter',
                16427: 'add_particle_note',
                16428: 'add_particle_witch_spell',
                16429: 'add_particle_carrot',
                16430: 'add_particle_mob_appearance',
                16431: 'add_particle_end_rod',
                16432: 'add_particle_dragons_breath',
                16433: 'add_particle_spit',
                16434: 'add_particle_totem',
                16435: 'add_particle_food',
                16436: 'add_particle_fireworks_starter',
                16437: 'add_particle_fireworks_spark',
                16438: 'add_particle_fireworks_overlay',
                16439: 'add_particle_balloon_gas',
                16440: 'add_particle_colored_flame',
                16441: 'add_particle_sparkler',
                16442: 'add_particle_conduit',
                16443: 'add_particle_bubble_column_up',
                16444: 'add_particle_bubble_column_down',
                16445: 'add_particle_sneeze',
                16446: 'add_particle_shulker_bullet',
                16447: 'add_particle_bleach',
                16448: 'add_particle_dragon_destroy_block',
                16449: 'add_particle_mycelium_dust',
                16450: 'add_particle_falling_red_dust',
                16451: 'add_particle_campfire_smoke',
                16452: 'add_particle_tall_campfire_smoke',
                16453: 'add_particle_dragon_breath_fire',
                16454: 'add_particle_dragon_breath_trail',
                16455: 'add_particle_blue_flame',
                16456: 'add_particle_soul',
                16457: 'add_particle_obsidian_tear',
                16458: 'add_particle_portal_reverse',
                16459: 'add_particle_snowflake',
                16460: 'add_particle_vibration_signal',
                16461: 'add_particle_sculk_sensor_redstone',
                16462: 'add_particle_spore_blossom_shower',
                16463: 'add_particle_spore_blossom_ambient',
                16464: 'add_particle_wax',
                16465: 'add_particle_electric_spark',
              },
            },
          ],
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'data',
          type: 'zigzag32',
        },
      ],
    ],
    packet_block_event: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'sound',
                1: 'change_state',
              },
            },
          ],
        },
        {
          name: 'data',
          type: 'zigzag32',
        },
      ],
    ],
    packet_entity_event: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'event_id',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'jump',
                2: 'hurt_animation',
                3: 'death_animation',
                4: 'arm_swing',
                5: 'stop_attack',
                6: 'tame_fail',
                7: 'tame_success',
                8: 'shake_wet',
                9: 'use_item',
                10: 'eat_grass_animation',
                11: 'fish_hook_bubble',
                12: 'fish_hook_position',
                13: 'fish_hook_hook',
                14: 'fish_hook_tease',
                15: 'squid_ink_cloud',
                16: 'zombie_villager_cure',
                18: 'respawn',
                19: 'iron_golem_offer_flower',
                20: 'iron_golem_withdraw_flower',
                21: 'love_particles',
                22: 'villager_angry',
                23: 'villager_happy',
                24: 'witch_spell_particles',
                25: 'firework_particles',
                26: 'in_love_particles',
                27: 'silverfish_spawn_animation',
                28: 'guardian_attack',
                29: 'witch_drink_potion',
                30: 'witch_throw_potion',
                31: 'minecart_tnt_prime_fuse',
                32: 'creeper_prime_fuse',
                33: 'air_supply_expired',
                34: 'player_add_xp_levels',
                35: 'elder_guardian_curse',
                36: 'agent_arm_swing',
                37: 'ender_dragon_death',
                38: 'dust_particles',
                39: 'arrow_shake',
                57: 'eating_item',
                60: 'baby_animal_feed',
                61: 'death_smoke_cloud',
                62: 'complete_trade',
                63: 'remove_leash',
                64: 'caravan',
                65: 'consume_totem',
                66: 'player_check_treasure_hunter_achievement',
                67: 'entity_spawn',
                68: 'dragon_puke',
                69: 'item_entity_merge',
                70: 'start_swim',
                71: 'balloon_pop',
                72: 'treasure_hunt',
                73: 'agent_summon',
                74: 'charged_item',
                75: 'fall',
                76: 'grow_up',
                77: 'vibration_detected',
                78: 'drink_milk',
              },
            },
          ],
        },
        {
          name: 'data',
          type: 'zigzag32',
        },
      ],
    ],
    packet_mob_effect: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'event_id',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'add',
                2: 'update',
                3: 'remove',
              },
            },
          ],
        },
        {
          name: 'effect_id',
          type: 'zigzag32',
        },
        {
          name: 'amplifier',
          type: 'zigzag32',
        },
        {
          name: 'particles',
          type: 'bool',
        },
        {
          name: 'duration',
          type: 'zigzag32',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_update_attributes: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'attributes',
          type: 'PlayerAttributes',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_inventory_transaction: [
      'container',
      [
        {
          name: 'transaction',
          type: 'Transaction',
        },
      ],
    ],
    packet_mob_equipment: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'item',
          type: 'Item',
        },
        {
          name: 'slot',
          type: 'u8',
        },
        {
          name: 'selected_slot',
          type: 'u8',
        },
        {
          name: 'window_id',
          type: 'WindowID',
        },
      ],
    ],
    packet_mob_armor_equipment: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'helmet',
          type: 'Item',
        },
        {
          name: 'chestplate',
          type: 'Item',
        },
        {
          name: 'leggings',
          type: 'Item',
        },
        {
          name: 'boots',
          type: 'Item',
        },
        {
          name: 'body',
          type: 'Item',
        },
      ],
    ],
    packet_interact: [
      'container',
      [
        {
          name: 'action_id',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                3: 'leave_vehicle',
                4: 'mouse_over_entity',
                5: 'npc_open',
                6: 'open_inventory',
              },
            },
          ],
        },
        {
          name: 'target_entity_id',
          type: 'varint64',
        },
        {
          name: 'position',
          type: [
            'switch',
            {
              compareTo: 'action_id',
              fields: {
                mouse_over_entity: 'vec3f',
                leave_vehicle: 'vec3f',
              },
            },
          ],
        },
      ],
    ],
    packet_block_pick_request: [
      'container',
      [
        {
          name: 'x',
          type: 'zigzag32',
        },
        {
          name: 'y',
          type: 'zigzag32',
        },
        {
          name: 'z',
          type: 'zigzag32',
        },
        {
          name: 'add_user_data',
          type: 'bool',
        },
        {
          name: 'selected_slot',
          type: 'u8',
        },
      ],
    ],
    packet_entity_pick_request: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'lu64',
        },
        {
          name: 'selected_slot',
          type: 'u8',
        },
        {
          name: 'with_data',
          type: 'bool',
        },
      ],
    ],
    packet_player_action: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'action',
          type: 'Action',
        },
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'result_position',
          type: 'BlockCoordinates',
        },
        {
          name: 'face',
          type: 'zigzag32',
        },
      ],
    ],
    packet_hurt_armor: [
      'container',
      [
        {
          name: 'cause',
          type: 'zigzag32',
        },
        {
          name: 'damage',
          type: 'zigzag32',
        },
        {
          name: 'armor_slots',
          type: 'zigzag64',
        },
      ],
    ],
    packet_set_entity_data: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'metadata',
          type: 'MetadataDictionary',
        },
        {
          name: 'properties',
          type: 'EntityProperties',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_set_entity_motion: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'velocity',
          type: 'vec3f',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_set_entity_link: [
      'container',
      [
        {
          name: 'link',
          type: 'Link',
        },
      ],
    ],
    packet_set_health: [
      'container',
      [
        {
          name: 'health',
          type: 'zigzag32',
        },
      ],
    ],
    packet_set_spawn_position: [
      'container',
      [
        {
          name: 'spawn_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'player',
                1: 'world',
              },
            },
          ],
        },
        {
          name: 'player_position',
          type: 'BlockCoordinates',
        },
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'world_position',
          type: 'BlockCoordinates',
        },
      ],
    ],
    packet_animate: [
      'container',
      [
        {
          name: 'action_id',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'swing_arm',
                2: 'unknown',
                3: 'wake_up',
                4: 'critical_hit',
                5: 'magic_critical_hit',
                128: 'row_right',
                129: 'row_left',
              },
            },
          ],
        },
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'action_id',
              fields: {
                row_right: [
                  'container',
                  [
                    {
                      name: 'boat_rowing_time',
                      type: 'lf32',
                    },
                  ],
                ],
                row_left: [
                  'container',
                  [
                    {
                      name: 'boat_rowing_time',
                      type: 'lf32',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_respawn: [
      'container',
      [
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'state',
          type: 'u8',
        },
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
      ],
    ],
    packet_container_open: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'window_type',
          type: 'WindowType',
        },
        {
          name: 'coordinates',
          type: 'BlockCoordinates',
        },
        {
          name: 'runtime_entity_id',
          type: 'zigzag64',
        },
      ],
    ],
    packet_container_close: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'window_type',
          type: 'WindowType',
        },
        {
          name: 'server',
          type: 'bool',
        },
      ],
    ],
    packet_player_hotbar: [
      'container',
      [
        {
          name: 'selected_slot',
          type: 'varint',
        },
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'select_slot',
          type: 'bool',
        },
      ],
    ],
    packet_inventory_content: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowIDVarint',
        },
        {
          name: 'input',
          type: 'ItemStacks',
        },
        {
          name: 'container',
          type: 'FullContainerName',
        },
        {
          name: 'storage_item',
          type: 'Item',
        },
      ],
    ],
    packet_inventory_slot: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowIDVarint',
        },
        {
          name: 'slot',
          type: 'varint',
        },
        {
          name: 'container',
          type: 'FullContainerName',
        },
        {
          name: 'storage_item',
          type: 'Item',
        },
        {
          name: 'item',
          type: 'Item',
        },
      ],
    ],
    packet_container_set_data: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'property',
          type: 'zigzag32',
        },
        {
          name: 'value',
          type: 'zigzag32',
        },
      ],
    ],
    packet_crafting_data: [
      'container',
      [
        {
          name: 'recipes',
          type: 'Recipes',
        },
        {
          name: 'potion_type_recipes',
          type: 'PotionTypeRecipes',
        },
        {
          name: 'potion_container_recipes',
          type: 'PotionContainerChangeRecipes',
        },
        {
          name: 'material_reducers',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'MaterialReducer',
            },
          ],
        },
        {
          name: 'clear_recipes',
          type: 'bool',
        },
      ],
    ],
    packet_crafting_event: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'recipe_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'inventory',
                1: 'crafting',
                2: 'workbench',
              },
            },
          ],
        },
        {
          name: 'recipe_id',
          type: 'uuid',
        },
        {
          name: 'input',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Item',
            },
          ],
        },
        {
          name: 'result',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Item',
            },
          ],
        },
      ],
    ],
    packet_gui_data_pick_item: [
      'container',
      [
        {
          name: 'item_name',
          type: 'string',
        },
        {
          name: 'item_effects',
          type: 'string',
        },
        {
          name: 'hotbar_slot',
          type: 'li32',
        },
      ],
    ],
    packet_adventure_settings: [
      'container',
      [
        {
          name: 'flags',
          type: 'AdventureFlags',
        },
        {
          name: 'command_permission',
          type: 'CommandPermissionLevelVarint',
        },
        {
          name: 'action_permissions',
          type: 'ActionPermissions',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'custom_stored_permissions',
          type: 'varint',
        },
        {
          name: 'user_id',
          type: 'li64',
        },
      ],
    ],
    AdventureFlags: [
      'bitflags',
      {
        type: 'varint',
        flags: {
          world_immutable: 1,
          no_pvp: 2,
          auto_jump: 32,
          allow_flight: 64,
          no_clip: 128,
          world_builder: 256,
          flying: 512,
          muted: 1024,
        },
      },
    ],
    ActionPermissions: [
      'bitflags',
      {
        type: 'varint',
        flags: {
          mine: 65537,
          doors_and_switches: 65538,
          open_containers: 65540,
          attack_players: 65544,
          attack_mobs: 65552,
          operator: 65568,
          teleport: 65664,
          build: 65792,
          default: 66048,
        },
      },
    ],
    packet_block_entity_data: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_player_input: [
      'container',
      [
        {
          name: 'motion_x',
          type: 'lf32',
        },
        {
          name: 'motion_z',
          type: 'lf32',
        },
        {
          name: 'jumping',
          type: 'bool',
        },
        {
          name: 'sneaking',
          type: 'bool',
        },
      ],
    ],
    packet_level_chunk: [
      'container',
      [
        {
          name: 'x',
          type: 'zigzag32',
        },
        {
          name: 'z',
          type: 'zigzag32',
        },
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'sub_chunk_count',
          type: 'varint',
        },
        {
          name: 'highest_subchunk_count',
          type: [
            'switch',
            {
              compareTo: 'sub_chunk_count',
              fields: {
                '-2': 'lu16',
              },
            },
          ],
        },
        {
          name: 'cache_enabled',
          type: 'bool',
        },
        {
          name: 'blobs',
          type: [
            'switch',
            {
              compareTo: 'cache_enabled',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'hashes',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'lu64',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'payload',
          type: 'ByteArray',
        },
      ],
    ],
    packet_set_commands_enabled: [
      'container',
      [
        {
          name: 'enabled',
          type: 'bool',
        },
      ],
    ],
    packet_set_difficulty: [
      'container',
      [
        {
          name: 'difficulty',
          type: 'varint',
        },
      ],
    ],
    packet_change_dimension: [
      'container',
      [
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'respawn',
          type: 'bool',
        },
        {
          name: 'loading_screen_id',
          type: [
            'option',
            'lu32',
          ],
        },
      ],
    ],
    packet_set_player_game_type: [
      'container',
      [
        {
          name: 'gamemode',
          type: 'GameMode',
        },
      ],
    ],
    packet_player_list: [
      'container',
      [
        {
          name: 'records',
          type: 'PlayerRecords',
        },
      ],
    ],
    packet_simple_event: [
      'container',
      [
        {
          name: 'event_type',
          type: [
            'mapper',
            {
              type: 'lu16',
              mappings: {
                0: 'uninitialized_subtype',
                1: 'enable_commands',
                2: 'disable_commands',
                3: 'unlock_world_template_settings',
              },
            },
          ],
        },
      ],
    ],
    packet_event: [
      'container',
      [
        {
          name: 'runtime_id',
          type: 'varint64',
        },
        {
          name: 'event_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'achievement_awarded',
                1: 'entity_interact',
                2: 'portal_built',
                3: 'portal_used',
                4: 'mob_killed',
                5: 'cauldron_used',
                6: 'player_death',
                7: 'boss_killed',
                8: 'agent_command',
                9: 'agent_created',
                10: 'banner_pattern_removed',
                11: 'command_executed',
                12: 'fish_bucketed',
                13: 'mob_born',
                14: 'pet_died',
                15: 'cauldron_block_used',
                16: 'composter_block_used',
                17: 'bell_block_used',
                18: 'actor_definition',
                19: 'raid_update',
                20: 'player_movement_anomaly',
                21: 'player_movement_corrected',
                22: 'honey_harvested',
                23: 'target_block_hit',
                24: 'piglin_barter',
                25: 'waxed_or_unwaxed_copper',
                26: 'code_builder_runtime_action',
                27: 'code_builder_scoreboard',
                28: 'strider_ridden_in_lava_in_overworld',
                29: 'sneak_close_to_sculk_sensor',
                30: 'careful_restoration',
                31: 'item_used',
              },
            },
          ],
        },
        {
          name: 'use_player_id',
          type: 'u8',
        },
        {
          name: 'event_data',
          type: 'restBuffer',
        },
      ],
    ],
    packet_spawn_experience_orb: [
      'container',
      [
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'count',
          type: 'zigzag32',
        },
      ],
    ],
    UpdateMapFlags: [
      'bitflags',
      {
        type: 'varint',
        flags: [
          'void',
          'texture',
          'decoration',
          'initialisation',
        ],
      },
    ],
    packet_clientbound_map_item_data: [
      'container',
      [
        {
          name: 'map_id',
          type: 'zigzag64',
        },
        {
          name: 'update_flags',
          type: 'UpdateMapFlags',
        },
        {
          name: 'dimension',
          type: 'u8',
        },
        {
          name: 'locked',
          type: 'bool',
        },
        {
          name: 'origin',
          type: 'vec3i',
        },
        {
          name: 'included_in',
          type: [
            'switch',
            {
              compareTo: 'update_flags.initialisation',
              fields: {
                true: [
                  'array',
                  {
                    countType: 'varint',
                    type: 'zigzag64',
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'scale',
          type: [
            'switch',
            {
              compareTo: 'update_flags.initialisation || update_flags.decoration || update_flags.texture',
              fields: {
                true: 'u8',
              },
            },
          ],
        },
        {
          name: 'tracked',
          type: [
            'switch',
            {
              compareTo: 'update_flags.decoration',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'objects',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'TrackedObject',
                        },
                      ],
                    },
                    {
                      name: 'decorations',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'MapDecoration',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'texture',
          type: [
            'switch',
            {
              compareTo: 'update_flags.texture',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'width',
                      type: 'zigzag32',
                    },
                    {
                      name: 'height',
                      type: 'zigzag32',
                    },
                    {
                      name: 'x_offset',
                      type: 'zigzag32',
                    },
                    {
                      name: 'y_offset',
                      type: 'zigzag32',
                    },
                    {
                      name: 'pixels',
                      type: [
                        'array',
                        {
                          countType: 'varint',
                          type: 'varint',
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_map_info_request: [
      'container',
      [
        {
          name: 'map_id',
          type: 'zigzag64',
        },
        {
          name: 'client_pixels',
          type: [
            'array',
            {
              countType: 'lu32',
              type: [
                'container',
                [
                  {
                    name: 'rgba',
                    type: 'li32',
                  },
                  {
                    name: 'index',
                    type: 'lu16',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_request_chunk_radius: [
      'container',
      [
        {
          name: 'chunk_radius',
          type: 'zigzag32',
        },
        {
          name: 'max_radius',
          type: 'u8',
        },
      ],
    ],
    packet_chunk_radius_update: [
      'container',
      [
        {
          name: 'chunk_radius',
          type: 'zigzag32',
        },
      ],
    ],
    packet_game_rules_changed: [
      'container',
      [
        {
          name: 'rules',
          type: 'GameRules',
        },
      ],
    ],
    packet_camera: [
      'container',
      [
        {
          name: 'camera_entity_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'target_player_unique_id',
          type: 'zigzag64',
        },
      ],
    ],
    packet_boss_event: [
      'container',
      [
        {
          name: 'boss_entity_id',
          type: 'zigzag64',
        },
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'show_bar',
                1: 'register_player',
                2: 'hide_bar',
                3: 'unregister_player',
                4: 'set_bar_progress',
                5: 'set_bar_title',
                6: 'update_properties',
                7: 'texture',
                8: 'query',
              },
            },
          ],
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                show_bar: [
                  'container',
                  [
                    {
                      name: 'title',
                      type: 'string',
                    },
                    {
                      name: 'progress',
                      type: 'lf32',
                    },
                    {
                      name: 'screen_darkening',
                      type: 'li16',
                    },
                    {
                      name: 'color',
                      type: 'varint',
                    },
                    {
                      name: 'overlay',
                      type: 'varint',
                    },
                  ],
                ],
                register_player: [
                  'container',
                  [
                    {
                      name: 'player_id',
                      type: 'zigzag64',
                    },
                  ],
                ],
                unregister_player: [
                  'container',
                  [
                    {
                      name: 'player_id',
                      type: 'zigzag64',
                    },
                  ],
                ],
                query: [
                  'container',
                  [
                    {
                      name: 'player_id',
                      type: 'zigzag64',
                    },
                  ],
                ],
                set_bar_progress: [
                  'container',
                  [
                    {
                      name: 'progress',
                      type: 'lf32',
                    },
                  ],
                ],
                set_bar_title: [
                  'container',
                  [
                    {
                      name: 'title',
                      type: 'string',
                    },
                  ],
                ],
                update_properties: [
                  'container',
                  [
                    {
                      name: 'screen_darkening',
                      type: 'li16',
                    },
                    {
                      name: 'color',
                      type: 'varint',
                    },
                    {
                      name: 'overlay',
                      type: 'varint',
                    },
                  ],
                ],
                texture: [
                  'container',
                  [
                    {
                      name: 'color',
                      type: 'varint',
                    },
                    {
                      name: 'overlay',
                      type: 'varint',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_show_credits: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'status',
          type: 'zigzag32',
        },
      ],
    ],
    packet_available_commands: [
      'container',
      [
        {
          name: 'values_len',
          type: 'varint',
        },
        {
          name: '_enum_type',
          type: [
            'enum_size_based_on_values_len',
          ],
        },
        {
          name: 'enum_values',
          type: [
            'array',
            {
              count: 'values_len',
              type: 'string',
            },
          ],
        },
        {
          name: 'chained_subcommand_values',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
        {
          name: 'suffixes',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
        {
          name: 'enums',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'values',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'switch',
                          {
                            compareTo: '../_enum_type',
                            fields: {
                              byte: 'u8',
                              short: 'lu16',
                              int: 'lu32',
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'chained_subcommands',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'values',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'container',
                          [
                            {
                              name: 'index',
                              type: 'lu16',
                            },
                            {
                              name: 'value',
                              type: 'lu16',
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'command_data',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'description',
                    type: 'string',
                  },
                  {
                    name: 'flags',
                    type: 'lu16',
                  },
                  {
                    name: 'permission_level',
                    type: 'u8',
                  },
                  {
                    name: 'alias',
                    type: 'li32',
                  },
                  {
                    name: 'chained_subcommand_offsets',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: 'lu16',
                      },
                    ],
                  },
                  {
                    name: 'overloads',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'container',
                          [
                            {
                              name: 'chaining',
                              type: 'bool',
                            },
                            {
                              name: 'parameters',
                              type: [
                                'array',
                                {
                                  countType: 'varint',
                                  type: [
                                    'container',
                                    [
                                      {
                                        name: 'parameter_name',
                                        type: 'string',
                                      },
                                      {
                                        name: 'value_type',
                                        type: [
                                          'mapper',
                                          {
                                            type: 'lu16',
                                            mappings: {
                                              1: 'int',
                                              3: 'float',
                                              4: 'value',
                                              5: 'wildcard_int',
                                              6: 'operator',
                                              7: 'command_operator',
                                              8: 'target',
                                              10: 'wildcard_target',
                                              17: 'file_path',
                                              23: 'integer_range',
                                              43: 'equipment_slots',
                                              44: 'string',
                                              52: 'block_position',
                                              53: 'position',
                                              55: 'message',
                                              58: 'raw_text',
                                              62: 'json',
                                              71: 'block_states',
                                              74: 'command',
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        name: 'enum_type',
                                        type: [
                                          'mapper',
                                          {
                                            type: 'lu16',
                                            mappings: {
                                              16: 'valid',
                                              48: 'enum',
                                              256: 'suffixed',
                                              1040: 'soft_enum',
                                            },
                                          },
                                        ],
                                      },
                                      {
                                        name: 'optional',
                                        type: 'bool',
                                      },
                                      {
                                        name: 'options',
                                        type: 'CommandFlags',
                                      },
                                    ],
                                  ],
                                },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'dynamic_enums',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'values',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: 'string',
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'enum_constraints',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'value_index',
                    type: 'li32',
                  },
                  {
                    name: 'enum_index',
                    type: 'li32',
                  },
                  {
                    name: 'constraints',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'container',
                          [
                            {
                              name: 'constraint',
                              type: [
                                'mapper',
                                {
                                  type: 'u8',
                                  mappings: {
                                    0: 'cheats_enabled',
                                    1: 'operator_permissions',
                                    2: 'host_permissions',
                                  },
                                },
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    CommandFlags: [
      'bitfield',
      [
        {
          name: 'unused',
          size: 1,
          signed: false,
        },
        {
          name: 'collapse_enum',
          size: 1,
          signed: false,
        },
        {
          name: 'has_semantic_constraint',
          size: 1,
          signed: false,
        },
        {
          name: 'as_chained_command',
          size: 1,
          signed: false,
        },
        {
          name: 'unknown2',
          size: 4,
          signed: false,
        },
      ],
    ],
    packet_command_request: [
      'container',
      [
        {
          name: 'command',
          type: 'string',
        },
        {
          name: 'origin',
          type: 'CommandOrigin',
        },
        {
          name: 'internal',
          type: 'bool',
        },
        {
          name: 'version',
          type: 'varint',
        },
      ],
    ],
    packet_command_block_update: [
      'container',
      [
        {
          name: 'is_block',
          type: 'bool',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'is_block',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'position',
                      type: 'BlockCoordinates',
                    },
                    {
                      name: 'mode',
                      type: [
                        'mapper',
                        {
                          type: 'varint',
                          mappings: {
                            0: 'impulse',
                            1: 'repeat',
                            2: 'chain',
                          },
                        },
                      ],
                    },
                    {
                      name: 'needs_redstone',
                      type: 'bool',
                    },
                    {
                      name: 'conditional',
                      type: 'bool',
                    },
                  ],
                ],
                false: [
                  'container',
                  [
                    {
                      name: 'minecart_entity_runtime_id',
                      type: 'varint64',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'command',
          type: 'string',
        },
        {
          name: 'last_output',
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'filtered_name',
          type: 'string',
        },
        {
          name: 'should_track_output',
          type: 'bool',
        },
        {
          name: 'tick_delay',
          type: 'li32',
        },
        {
          name: 'execute_on_first_tick',
          type: 'bool',
        },
      ],
    ],
    packet_command_output: [
      'container',
      [
        {
          name: 'origin',
          type: 'CommandOrigin',
        },
        {
          name: 'output_type',
          type: [
            'mapper',
            {
              type: 'i8',
              mappings: {
                1: 'last',
                2: 'silent',
                3: 'all',
                4: 'data_set',
              },
            },
          ],
        },
        {
          name: 'success_count',
          type: 'varint',
        },
        {
          name: 'output',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'success',
                    type: 'bool',
                  },
                  {
                    name: 'message_id',
                    type: 'string',
                  },
                  {
                    name: 'parameters',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: 'string',
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'data_set',
          type: [
            'switch',
            {
              compareTo: 'output_type',
              fields: {
                data_set: 'string',
              },
              default: 'void',
            },
          ],
        },
      ],
    ],
    packet_update_trade: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'window_type',
          type: 'WindowType',
        },
        {
          name: 'size',
          type: 'varint',
        },
        {
          name: 'trade_tier',
          type: 'varint',
        },
        {
          name: 'villager_unique_id',
          type: 'varint64',
        },
        {
          name: 'entity_unique_id',
          type: 'varint64',
        },
        {
          name: 'display_name',
          type: 'string',
        },
        {
          name: 'new_trading_ui',
          type: 'bool',
        },
        {
          name: 'economic_trades',
          type: 'bool',
        },
        {
          name: 'offers',
          type: 'nbt',
        },
      ],
    ],
    packet_update_equipment: [
      'container',
      [
        {
          name: 'window_id',
          type: 'WindowID',
        },
        {
          name: 'window_type',
          type: 'WindowType',
        },
        {
          name: 'size',
          type: 'u8',
        },
        {
          name: 'entity_id',
          type: 'zigzag64',
        },
        {
          name: 'inventory',
          type: 'nbt',
        },
      ],
    ],
    packet_resource_pack_data_info: [
      'container',
      [
        {
          name: 'pack_id',
          type: 'string',
        },
        {
          name: 'max_chunk_size',
          type: 'lu32',
        },
        {
          name: 'chunk_count',
          type: 'lu32',
        },
        {
          name: 'size',
          type: 'lu64',
        },
        {
          name: 'hash',
          type: 'ByteArray',
        },
        {
          name: 'is_premium',
          type: 'bool',
        },
        {
          name: 'pack_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'addon',
                2: 'cached',
                3: 'copy_protected',
                4: 'behavior',
                5: 'persona_piece',
                6: 'resources',
                7: 'skins',
                8: 'world_template',
              },
            },
          ],
        },
      ],
    ],
    packet_resource_pack_chunk_data: [
      'container',
      [
        {
          name: 'pack_id',
          type: 'string',
        },
        {
          name: 'chunk_index',
          type: 'lu32',
        },
        {
          name: 'progress',
          type: 'lu64',
        },
        {
          name: 'payload',
          type: 'ByteArray',
        },
      ],
    ],
    packet_resource_pack_chunk_request: [
      'container',
      [
        {
          name: 'pack_id',
          type: 'string',
        },
        {
          name: 'chunk_index',
          type: 'lu32',
        },
      ],
    ],
    packet_transfer: [
      'container',
      [
        {
          name: 'server_address',
          type: 'string',
        },
        {
          name: 'port',
          type: 'lu16',
        },
        {
          name: 'reload_world',
          type: 'bool',
        },
      ],
    ],
    packet_play_sound: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'coordinates',
          type: 'BlockCoordinates',
        },
        {
          name: 'volume',
          type: 'lf32',
        },
        {
          name: 'pitch',
          type: 'lf32',
        },
      ],
    ],
    packet_stop_sound: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'stop_all',
          type: 'bool',
        },
        {
          name: 'stop_music_legacy',
          type: 'bool',
        },
      ],
    ],
    packet_set_title: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'clear',
                1: 'reset',
                2: 'set_title',
                3: 'set_subtitle',
                4: 'action_bar_message',
                5: 'set_durations',
                6: 'set_title_json',
                7: 'set_subtitle_json',
                8: 'action_bar_message_json',
              },
            },
          ],
        },
        {
          name: 'text',
          type: 'string',
        },
        {
          name: 'fade_in_time',
          type: 'zigzag32',
        },
        {
          name: 'stay_time',
          type: 'zigzag32',
        },
        {
          name: 'fade_out_time',
          type: 'zigzag32',
        },
        {
          name: 'xuid',
          type: 'string',
        },
        {
          name: 'platform_online_id',
          type: 'string',
        },
        {
          name: 'filtered_message',
          type: 'string',
        },
      ],
    ],
    packet_add_behavior_tree: [
      'container',
      [
        {
          name: 'behaviortree',
          type: 'string',
        },
      ],
    ],
    packet_structure_block_update: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'structure_name',
          type: 'string',
        },
        {
          name: 'filtered_structure_name',
          type: 'string',
        },
        {
          name: 'data_field',
          type: 'string',
        },
        {
          name: 'include_players',
          type: 'bool',
        },
        {
          name: 'show_bounding_box',
          type: 'bool',
        },
        {
          name: 'structure_block_type',
          type: 'zigzag32',
        },
        {
          name: 'settings',
          type: 'StructureBlockSettings',
        },
        {
          name: 'redstone_save_mode',
          type: 'zigzag32',
        },
        {
          name: 'should_trigger',
          type: 'bool',
        },
        {
          name: 'water_logged',
          type: 'bool',
        },
      ],
    ],
    packet_show_store_offer: [
      'container',
      [
        {
          name: 'offer_id',
          type: 'string',
        },
        {
          name: 'redirect_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'marketplace',
                1: 'dressing_room',
                2: 'third_party_server_page',
              },
            },
          ],
        },
      ],
    ],
    packet_purchase_receipt: [
      'container',
      [
        {
          name: 'receipts',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
      ],
    ],
    packet_player_skin: [
      'container',
      [
        {
          name: 'uuid',
          type: 'uuid',
        },
        {
          name: 'skin',
          type: 'Skin',
        },
        {
          name: 'skin_name',
          type: 'string',
        },
        {
          name: 'old_skin_name',
          type: 'string',
        },
        {
          name: 'is_verified',
          type: 'bool',
        },
      ],
    ],
    packet_sub_client_login: [
      'container',
      [
        {
          name: 'tokens',
          type: [
            'encapsulated',
            {
              lengthType: 'varint',
              type: 'LoginTokens',
            },
          ],
        },
      ],
    ],
    packet_initiate_web_socket_connection: [
      'container',
      [
        {
          name: 'server',
          type: 'string',
        },
      ],
    ],
    packet_set_last_hurt_by: [
      'container',
      [
        {
          name: 'entity_type',
          type: 'varint',
        },
      ],
    ],
    packet_book_edit: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'replace_page',
                1: 'add_page',
                2: 'delete_page',
                3: 'swap_pages',
                4: 'sign',
              },
            },
          ],
        },
        {
          name: 'slot',
          type: 'u8',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                replace_page: [
                  'container',
                  [
                    {
                      name: 'page_number',
                      type: 'u8',
                    },
                    {
                      name: 'text',
                      type: 'string',
                    },
                    {
                      name: 'photo_name',
                      type: 'string',
                    },
                  ],
                ],
                add_page: [
                  'container',
                  [
                    {
                      name: 'page_number',
                      type: 'u8',
                    },
                    {
                      name: 'text',
                      type: 'string',
                    },
                    {
                      name: 'photo_name',
                      type: 'string',
                    },
                  ],
                ],
                delete_page: [
                  'container',
                  [
                    {
                      name: 'page_number',
                      type: 'u8',
                    },
                  ],
                ],
                swap_pages: [
                  'container',
                  [
                    {
                      name: 'page1',
                      type: 'u8',
                    },
                    {
                      name: 'page2',
                      type: 'u8',
                    },
                  ],
                ],
                sign: [
                  'container',
                  [
                    {
                      name: 'title',
                      type: 'string',
                    },
                    {
                      name: 'author',
                      type: 'string',
                    },
                    {
                      name: 'xuid',
                      type: 'string',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_npc_request: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'request_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'set_actions',
                1: 'execute_action',
                2: 'execute_closing_commands',
                3: 'set_name',
                4: 'set_skin',
                5: 'set_interaction_text',
                6: 'execute_opening_commands',
              },
            },
          ],
        },
        {
          name: 'command',
          type: 'string',
        },
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'set_actions',
                1: 'execute_action',
                2: 'execute_closing_commands',
                3: 'set_name',
                4: 'set_skin',
                5: 'set_interact_text',
                6: 'execute_opening_commands',
              },
            },
          ],
        },
        {
          name: 'scene_name',
          type: 'string',
        },
      ],
    ],
    packet_photo_transfer: [
      'container',
      [
        {
          name: 'image_name',
          type: 'string',
        },
        {
          name: 'image_data',
          type: 'string',
        },
        {
          name: 'book_id',
          type: 'string',
        },
        {
          name: 'photo_type',
          type: 'u8',
        },
        {
          name: 'source_type',
          type: 'u8',
        },
        {
          name: 'owner_entity_unique_id',
          type: 'li64',
        },
        {
          name: 'new_photo_name',
          type: 'string',
        },
      ],
    ],
    packet_modal_form_request: [
      'container',
      [
        {
          name: 'form_id',
          type: 'varint',
        },
        {
          name: 'data',
          type: 'string',
        },
      ],
    ],
    packet_modal_form_response: [
      'container',
      [
        {
          name: 'form_id',
          type: 'varint',
        },
        {
          name: 'has_response_data',
          type: 'bool',
        },
        {
          name: 'data',
          type: [
            'switch',
            {
              compareTo: 'has_response_data',
              fields: {
                true: 'string',
              },
            },
          ],
        },
        {
          name: 'has_cancel_reason',
          type: 'bool',
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'has_cancel_reason',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'cancel_reason',
                      type: [
                        'mapper',
                        {
                          type: 'u8',
                          mappings: {
                            0: 'closed',
                            1: 'busy',
                          },
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_server_settings_request: [
      'container',
      [],
    ],
    packet_server_settings_response: [
      'container',
      [
        {
          name: 'form_id',
          type: 'varint',
        },
        {
          name: 'data',
          type: 'string',
        },
      ],
    ],
    packet_show_profile: [
      'container',
      [
        {
          name: 'xuid',
          type: 'string',
        },
      ],
    ],
    packet_set_default_game_type: [
      'container',
      [
        {
          name: 'gamemode',
          type: 'GameMode',
        },
      ],
    ],
    packet_remove_objective: [
      'container',
      [
        {
          name: 'objective_name',
          type: 'string',
        },
      ],
    ],
    packet_set_display_objective: [
      'container',
      [
        {
          name: 'display_slot',
          type: 'string',
        },
        {
          name: 'objective_name',
          type: 'string',
        },
        {
          name: 'display_name',
          type: 'string',
        },
        {
          name: 'criteria_name',
          type: 'string',
        },
        {
          name: 'sort_order',
          type: 'zigzag32',
        },
      ],
    ],
    packet_set_score: [
      'container',
      [
        {
          name: 'action',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'change',
                1: 'remove',
              },
            },
          ],
        },
        {
          name: 'entries',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'scoreboard_id',
                    type: 'zigzag64',
                  },
                  {
                    name: 'objective_name',
                    type: 'string',
                  },
                  {
                    name: 'score',
                    type: 'li32',
                  },
                  {
                    anon: true,
                    type: [
                      'switch',
                      {
                        compareTo: '../action',
                        fields: {
                          change: [
                            'container',
                            [
                              {
                                name: 'entry_type',
                                type: [
                                  'mapper',
                                  {
                                    type: 'i8',
                                    mappings: {
                                      1: 'player',
                                      2: 'entity',
                                      3: 'fake_player',
                                    },
                                  },
                                ],
                              },
                              {
                                name: 'entity_unique_id',
                                type: [
                                  'switch',
                                  {
                                    compareTo: 'entry_type',
                                    fields: {
                                      player: 'zigzag64',
                                      entity: 'zigzag64',
                                    },
                                  },
                                ],
                              },
                              {
                                name: 'custom_name',
                                type: [
                                  'switch',
                                  {
                                    compareTo: 'entry_type',
                                    fields: {
                                      fake_player: 'string',
                                    },
                                  },
                                ],
                              },
                            ],
                          ],
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_lab_table: [
      'container',
      [
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'combine',
                1: 'react',
                2: 'reset',
              },
            },
          ],
        },
        {
          name: 'position',
          type: 'vec3i',
        },
        {
          name: 'reaction_type',
          type: 'u8',
        },
      ],
    ],
    packet_update_block_synced: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'block_runtime_id',
          type: 'varint',
        },
        {
          name: 'flags',
          type: 'UpdateBlockFlags',
        },
        {
          name: 'layer',
          type: 'varint',
        },
        {
          name: 'entity_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'transition_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'entity',
                1: 'create',
                2: 'destroy',
              },
            },
          ],
        },
      ],
    ],
    packet_move_entity_delta: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
        {
          name: 'flags',
          type: 'DeltaMoveFlags',
        },
        {
          name: 'x',
          type: [
            'switch',
            {
              compareTo: 'flags.has_x',
              fields: {
                true: 'lf32',
              },
            },
          ],
        },
        {
          name: 'y',
          type: [
            'switch',
            {
              compareTo: 'flags.has_y',
              fields: {
                true: 'lf32',
              },
            },
          ],
        },
        {
          name: 'z',
          type: [
            'switch',
            {
              compareTo: 'flags.has_z',
              fields: {
                true: 'lf32',
              },
            },
          ],
        },
        {
          name: 'rot_x',
          type: [
            'switch',
            {
              compareTo: 'flags.has_rot_x',
              fields: {
                true: 'u8',
              },
            },
          ],
        },
        {
          name: 'rot_y',
          type: [
            'switch',
            {
              compareTo: 'flags.has_rot_y',
              fields: {
                true: 'u8',
              },
            },
          ],
        },
        {
          name: 'rot_z',
          type: [
            'switch',
            {
              compareTo: 'flags.has_rot_z',
              fields: {
                true: 'u8',
              },
            },
          ],
        },
      ],
    ],
    DeltaMoveFlags: [
      'bitflags',
      {
        type: 'lu16',
        flags: {
          has_x: 1,
          has_y: 2,
          has_z: 4,
          has_rot_x: 8,
          has_rot_y: 16,
          has_rot_z: 32,
          on_ground: 64,
          teleport: 128,
          force_move: 256,
        },
      },
    ],
    packet_set_scoreboard_identity: [
      'container',
      [
        {
          name: 'action',
          type: [
            'mapper',
            {
              type: 'i8',
              mappings: {
                0: 'register_identity',
                1: 'clear_identity',
              },
            },
          ],
        },
        {
          name: 'entries',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'scoreboard_id',
                    type: 'zigzag64',
                  },
                  {
                    name: 'entity_unique_id',
                    type: [
                      'switch',
                      {
                        compareTo: '../action',
                        fields: {
                          register_identity: 'zigzag64',
                        },
                        default: 'void',
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_set_local_player_as_initialized: [
      'container',
      [
        {
          name: 'runtime_entity_id',
          type: 'varint64',
        },
      ],
    ],
    packet_update_soft_enum: [
      'container',
      [
        {
          name: 'enum_type',
          type: 'string',
        },
        {
          name: 'options',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'add',
                1: 'remove',
                2: 'update',
              },
            },
          ],
        },
      ],
    ],
    packet_network_stack_latency: [
      'container',
      [
        {
          name: 'timestamp',
          type: 'lu64',
        },
        {
          name: 'needs_response',
          type: 'u8',
        },
      ],
    ],
    packet_script_custom_event: [
      'container',
      [
        {
          name: 'event_name',
          type: 'string',
        },
        {
          name: 'event_data',
          type: 'string',
        },
      ],
    ],
    packet_spawn_particle_effect: [
      'container',
      [
        {
          name: 'dimension',
          type: 'u8',
        },
        {
          name: 'entity_id',
          type: 'zigzag64',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'particle_name',
          type: 'string',
        },
        {
          name: 'molang_variables',
          type: [
            'option',
            'string',
          ],
        },
      ],
    ],
    packet_available_entity_identifiers: [
      'container',
      [
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_level_sound_event_v2: [
      'container',
      [
        {
          name: 'sound_id',
          type: 'u8',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'block_id',
          type: 'zigzag32',
        },
        {
          name: 'entity_type',
          type: 'string',
        },
        {
          name: 'is_baby_mob',
          type: 'bool',
        },
        {
          name: 'is_global',
          type: 'bool',
        },
      ],
    ],
    packet_network_chunk_publisher_update: [
      'container',
      [
        {
          name: 'coordinates',
          type: 'BlockCoordinates',
        },
        {
          name: 'radius',
          type: 'varint',
        },
        {
          name: 'saved_chunks',
          type: [
            'array',
            {
              countType: 'lu32',
              type: [
                'container',
                [
                  {
                    name: 'x',
                    type: 'zigzag32',
                  },
                  {
                    name: 'z',
                    type: 'zigzag32',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_biome_definition_list: [
      'container',
      [
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_level_sound_event: [
      'container',
      [
        {
          name: 'sound_id',
          type: 'SoundType',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'extra_data',
          type: 'zigzag32',
        },
        {
          name: 'entity_type',
          type: 'string',
        },
        {
          name: 'is_baby_mob',
          type: 'bool',
        },
        {
          name: 'is_global',
          type: 'bool',
        },
      ],
    ],
    packet_level_event_generic: [
      'container',
      [
        {
          name: 'event_id',
          type: 'varint',
        },
        {
          name: 'nbt',
          type: 'nbtLoop',
        },
      ],
    ],
    packet_lectern_update: [
      'container',
      [
        {
          name: 'page',
          type: 'u8',
        },
        {
          name: 'page_count',
          type: 'u8',
        },
        {
          name: 'position',
          type: 'vec3i',
        },
      ],
    ],
    packet_video_stream_connect: [
      'container',
      [
        {
          name: 'server_uri',
          type: 'string',
        },
        {
          name: 'frame_send_frequency',
          type: 'lf32',
        },
        {
          name: 'action',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'none',
                2: 'close',
              },
            },
          ],
        },
        {
          name: 'resolution_x',
          type: 'li32',
        },
        {
          name: 'resolution_y',
          type: 'li32',
        },
      ],
    ],
    packet_client_cache_status: [
      'container',
      [
        {
          name: 'enabled',
          type: 'bool',
        },
      ],
    ],
    packet_on_screen_texture_animation: [
      'container',
      [
        {
          name: 'animation_type',
          type: 'lu32',
        },
      ],
    ],
    packet_map_create_locked_copy: [
      'container',
      [
        {
          name: 'original_map_id',
          type: 'zigzag64',
        },
        {
          name: 'new_map_id',
          type: 'zigzag64',
        },
      ],
    ],
    packet_structure_template_data_export_request: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'settings',
          type: 'StructureBlockSettings',
        },
        {
          name: 'request_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'export_from_save',
                2: 'export_from_load',
                3: 'query_saved_structure',
                4: 'import_from_save',
              },
            },
          ],
        },
      ],
    ],
    packet_structure_template_data_export_response: [
      'container',
      [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'success',
          type: 'bool',
        },
        {
          name: 'nbt',
          type: [
            'switch',
            {
              compareTo: 'success',
              fields: {
                true: 'nbt',
              },
            },
          ],
        },
        {
          name: 'response_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'export',
                2: 'query',
                3: 'import',
              },
            },
          ],
        },
      ],
    ],
    packet_update_block_properties: [
      'container',
      [
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_client_cache_blob_status: [
      'container',
      [
        {
          name: 'misses',
          type: 'varint',
        },
        {
          name: 'haves',
          type: 'varint',
        },
        {
          name: 'missing',
          type: [
            'array',
            {
              count: 'misses',
              type: 'lu64',
            },
          ],
        },
        {
          name: 'have',
          type: [
            'array',
            {
              count: 'haves',
              type: 'lu64',
            },
          ],
        },
      ],
    ],
    packet_client_cache_miss_response: [
      'container',
      [
        {
          name: 'blobs',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Blob',
            },
          ],
        },
      ],
    ],
    packet_education_settings: [
      'container',
      [
        {
          name: 'CodeBuilderDefaultURI',
          type: 'string',
        },
        {
          name: 'CodeBuilderTitle',
          type: 'string',
        },
        {
          name: 'CanResizeCodeBuilder',
          type: 'bool',
        },
        {
          name: 'disable_legacy_title_bar',
          type: 'bool',
        },
        {
          name: 'post_process_filter',
          type: 'string',
        },
        {
          name: 'screenshot_border_path',
          type: 'string',
        },
        {
          name: 'has_agent_capabilities',
          type: 'bool',
        },
        {
          name: 'agent_capabilities',
          type: [
            'switch',
            {
              compareTo: 'has_agent_capabilities',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'has',
                      type: 'bool',
                    },
                    {
                      name: 'can_modify_blocks',
                      type: 'bool',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'HasOverrideURI',
          type: 'bool',
        },
        {
          name: 'OverrideURI',
          type: [
            'switch',
            {
              compareTo: 'HasOverrideURI',
              fields: {
                true: 'string',
              },
            },
          ],
        },
        {
          name: 'HasQuiz',
          type: 'bool',
        },
        {
          name: 'has_external_link_settings',
          type: 'bool',
        },
        {
          name: 'external_link_settings',
          type: [
            'switch',
            {
              compareTo: 'has_external_link_settings',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'has',
                      type: 'bool',
                    },
                    {
                      name: 'url',
                      type: 'string',
                    },
                    {
                      name: 'display_name',
                      type: 'string',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_emote: [
      'container',
      [
        {
          name: 'entity_id',
          type: 'varint64',
        },
        {
          name: 'emote_id',
          type: 'string',
        },
        {
          name: 'emote_length_ticks',
          type: 'varint',
        },
        {
          name: 'xuid',
          type: 'string',
        },
        {
          name: 'platform_id',
          type: 'string',
        },
        {
          name: 'flags',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'server_side',
                2: 'mute_chat',
              },
            },
          ],
        },
      ],
    ],
    packet_multiplayer_settings: [
      'container',
      [
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'enable_multiplayer',
                1: 'disable_multiplayer',
                2: 'refresh_join_code',
              },
            },
          ],
        },
      ],
    ],
    packet_settings_command: [
      'container',
      [
        {
          name: 'command_line',
          type: 'string',
        },
        {
          name: 'suppress_output',
          type: 'bool',
        },
      ],
    ],
    packet_anvil_damage: [
      'container',
      [
        {
          name: 'damage',
          type: 'u8',
        },
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
      ],
    ],
    packet_completed_using_item: [
      'container',
      [
        {
          name: 'used_item_id',
          type: 'li16',
        },
        {
          name: 'use_method',
          type: [
            'mapper',
            {
              type: 'li32',
              mappings: {
                0: 'equip_armor',
                1: 'eat',
                2: 'attack',
                3: 'consume',
                4: 'throw',
                5: 'shoot',
                6: 'place',
                7: 'fill_bottle',
                8: 'fill_bucket',
                9: 'pour_bucket',
                10: 'use_tool',
                11: 'interact',
                12: 'retrieved',
                13: 'dyed',
                14: 'traded',
                15: 'brushing_completed',
                16: 'opened_vault',
              },
            },
          ],
        },
      ],
    ],
    packet_network_settings: [
      'container',
      [
        {
          name: 'compression_threshold',
          type: 'lu16',
        },
        {
          name: 'compression_algorithm',
          type: [
            'mapper',
            {
              type: 'lu16',
              mappings: {
                0: 'deflate',
                1: 'snappy',
              },
            },
          ],
        },
        {
          name: 'client_throttle',
          type: 'bool',
        },
        {
          name: 'client_throttle_threshold',
          type: 'u8',
        },
        {
          name: 'client_throttle_scalar',
          type: 'lf32',
        },
      ],
    ],
    packet_player_auth_input: [
      'container',
      [
        {
          name: 'pitch',
          type: 'lf32',
        },
        {
          name: 'yaw',
          type: 'lf32',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'move_vector',
          type: 'vec2f',
        },
        {
          name: 'head_yaw',
          type: 'lf32',
        },
        {
          name: 'input_data',
          type: 'InputFlag',
        },
        {
          name: 'input_mode',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'unknown',
                1: 'mouse',
                2: 'touch',
                3: 'game_pad',
                4: 'motion_controller',
              },
            },
          ],
        },
        {
          name: 'play_mode',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'normal',
                1: 'teaser',
                2: 'screen',
                3: 'viewer',
                4: 'reality',
                5: 'placement',
                6: 'living_room',
                7: 'exit_level',
                8: 'exit_level_living_room',
                9: 'num_modes',
              },
            },
          ],
        },
        {
          name: 'interaction_model',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'touch',
                1: 'crosshair',
                2: 'classic',
              },
            },
          ],
        },
        {
          name: 'interact_rotation',
          type: 'vec2f',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
        {
          name: 'delta',
          type: 'vec3f',
        },
        {
          name: 'transaction',
          type: [
            'switch',
            {
              compareTo: 'input_data.item_interact',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'legacy',
                      type: 'TransactionLegacy',
                    },
                    {
                      name: 'actions',
                      type: 'TransactionActions',
                    },
                    {
                      name: 'data',
                      type: 'TransactionUseItem',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'item_stack_request',
          type: [
            'switch',
            {
              compareTo: 'input_data.item_stack_request',
              fields: {
                true: 'ItemStackRequest',
              },
            },
          ],
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'input_data.client_predicted_vehicle',
              fields: {
                true: [
                  'container',
                  [
                    {
                      name: 'vehicle_rotation',
                      type: 'vec2f',
                    },
                    {
                      name: 'predicted_vehicle',
                      type: 'zigzag64',
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'block_action',
          type: [
            'switch',
            {
              compareTo: 'input_data.block_action',
              fields: {
                true: [
                  'array',
                  {
                    countType: 'zigzag32',
                    type: [
                      'container',
                      [
                        {
                          name: 'action',
                          type: 'Action',
                        },
                        {
                          anon: true,
                          type: [
                            'switch',
                            {
                              compareTo: 'action',
                              fields: {
                                start_break: [
                                  'container',
                                  [
                                    {
                                      name: 'position',
                                      type: 'vec3i',
                                    },
                                    {
                                      name: 'face',
                                      type: 'zigzag32',
                                    },
                                  ],
                                ],
                                abort_break: [
                                  'container',
                                  [
                                    {
                                      name: 'position',
                                      type: 'vec3i',
                                    },
                                    {
                                      name: 'face',
                                      type: 'zigzag32',
                                    },
                                  ],
                                ],
                                crack_break: [
                                  'container',
                                  [
                                    {
                                      name: 'position',
                                      type: 'vec3i',
                                    },
                                    {
                                      name: 'face',
                                      type: 'zigzag32',
                                    },
                                  ],
                                ],
                                predict_break: [
                                  'container',
                                  [
                                    {
                                      name: 'position',
                                      type: 'vec3i',
                                    },
                                    {
                                      name: 'face',
                                      type: 'zigzag32',
                                    },
                                  ],
                                ],
                                continue_break: [
                                  'container',
                                  [
                                    {
                                      name: 'position',
                                      type: 'vec3i',
                                    },
                                    {
                                      name: 'face',
                                      type: 'zigzag32',
                                    },
                                  ],
                                ],
                              },
                            },
                          ],
                        },
                      ],
                    ],
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'analogue_move_vector',
          type: 'vec2f',
        },
        {
          name: 'camera_orientation',
          type: 'vec3f',
        },
        {
          name: 'raw_move_vector',
          type: 'vec2f',
        },
      ],
    ],
    InputFlag: [
      'bitflags',
      {
        type: 'varint128',
        big: true,
        flags: [
          'ascend',
          'descend',
          'north_jump',
          'jump_down',
          'sprint_down',
          'change_height',
          'jumping',
          'auto_jumping_in_water',
          'sneaking',
          'sneak_down',
          'up',
          'down',
          'left',
          'right',
          'up_left',
          'up_right',
          'want_up',
          'want_down',
          'want_down_slow',
          'want_up_slow',
          'sprinting',
          'ascend_block',
          'descend_block',
          'sneak_toggle_down',
          'persist_sneak',
          'start_sprinting',
          'stop_sprinting',
          'start_sneaking',
          'stop_sneaking',
          'start_swimming',
          'stop_swimming',
          'start_jumping',
          'start_gliding',
          'stop_gliding',
          'item_interact',
          'block_action',
          'item_stack_request',
          'handled_teleport',
          'emoting',
          'missed_swing',
          'start_crawling',
          'stop_crawling',
          'start_flying',
          'stop_flying',
          'received_server_data',
          'client_predicted_vehicle',
          'paddling_left',
          'paddling_right',
          'block_breaking_delay_enabled',
          'horizontal_collision',
          'vertical_collision',
          'down_left',
          'down_right',
          'start_using_item',
          'camera_relative_movement_enabled',
          'rot_controlled_by_move_direction',
          'start_spin_attack',
          'stop_spin_attack',
          'hotbar_only_touch',
          'jump_released_raw',
          'jump_pressed_raw',
          'jump_current_raw',
          'sneak_released_raw',
          'sneak_pressed_raw',
          'sneak_current_raw',
        ],
      },
    ],
    packet_creative_content: [
      'container',
      [
        {
          name: 'groups',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'category',
                    type: 'CreativeItemCategory',
                  },
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'icon_item',
                    type: 'ItemLegacy',
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'items',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'item_index',
                    type: 'varint',
                  },
                  {
                    name: 'item_instance',
                    type: 'ItemLegacy',
                  },
                  {
                    name: 'group_index',
                    type: 'varint',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_player_enchant_options: [
      'container',
      [
        {
          name: 'options',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'EnchantOption',
            },
          ],
        },
      ],
    ],
    packet_item_stack_request: [
      'container',
      [
        {
          name: 'requests',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'ItemStackRequest',
            },
          ],
        },
      ],
    ],
    packet_item_stack_response: [
      'container',
      [
        {
          name: 'responses',
          type: 'ItemStackResponses',
        },
      ],
    ],
    packet_player_armor_damage: [
      'container',
      [
        {
          name: 'type',
          type: 'ArmorDamageType',
        },
        {
          name: 'helmet_damage',
          type: [
            'switch',
            {
              compareTo: 'type.head',
              fields: {
                true: 'zigzag32',
              },
            },
          ],
        },
        {
          name: 'chestplate_damage',
          type: [
            'switch',
            {
              compareTo: 'type.chest',
              fields: {
                true: 'zigzag32',
              },
            },
          ],
        },
        {
          name: 'leggings_damage',
          type: [
            'switch',
            {
              compareTo: 'type.legs',
              fields: {
                true: 'zigzag32',
              },
            },
          ],
        },
        {
          name: 'boots_damage',
          type: [
            'switch',
            {
              compareTo: 'type.feet',
              fields: {
                true: 'zigzag32',
              },
            },
          ],
        },
        {
          name: 'body_damage',
          type: [
            'switch',
            {
              compareTo: 'type.body',
              fields: {
                true: 'zigzag32',
              },
            },
          ],
        },
      ],
    ],
    ArmorDamageType: [
      'bitflags',
      {
        type: 'u8',
        flags: {
          head: 1,
          chest: 2,
          legs: 4,
          feet: 8,
          body: 16,
        },
      },
    ],
    packet_update_player_game_type: [
      'container',
      [
        {
          name: 'gamemode',
          type: 'GameMode',
        },
        {
          name: 'player_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_emote_list: [
      'container',
      [
        {
          name: 'player_id',
          type: 'varint64',
        },
        {
          name: 'emote_pieces',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'uuid',
            },
          ],
        },
      ],
    ],
    packet_position_tracking_db_request: [
      'container',
      [
        {
          name: 'action',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'query',
              },
            },
          ],
        },
        {
          name: 'tracking_id',
          type: 'zigzag32',
        },
      ],
    ],
    packet_position_tracking_db_broadcast: [
      'container',
      [
        {
          name: 'broadcast_action',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'update',
                1: 'destory',
                2: 'not_found',
              },
            },
          ],
        },
        {
          name: 'tracking_id',
          type: 'zigzag32',
        },
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_packet_violation_warning: [
      'container',
      [
        {
          name: 'violation_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'malformed',
              },
            },
          ],
        },
        {
          name: 'severity',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'warning',
                1: 'final_warning',
                2: 'terminating',
              },
            },
          ],
        },
        {
          name: 'packet_id',
          type: 'zigzag32',
        },
        {
          name: 'reason',
          type: 'string',
        },
      ],
    ],
    packet_motion_prediction_hints: [
      'container',
      [
        {
          name: 'entity_runtime_id',
          type: 'varint64',
        },
        {
          name: 'velocity',
          type: 'vec3f',
        },
        {
          name: 'on_ground',
          type: 'bool',
        },
      ],
    ],
    packet_animate_entity: [
      'container',
      [
        {
          name: 'animation',
          type: 'string',
        },
        {
          name: 'next_state',
          type: 'string',
        },
        {
          name: 'stop_condition',
          type: 'string',
        },
        {
          name: 'stop_condition_version',
          type: 'li32',
        },
        {
          name: 'controller',
          type: 'string',
        },
        {
          name: 'blend_out_time',
          type: 'lf32',
        },
        {
          name: 'runtime_entity_ids',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'varint64',
            },
          ],
        },
      ],
    ],
    packet_camera_shake: [
      'container',
      [
        {
          name: 'intensity',
          type: 'lf32',
        },
        {
          name: 'duration',
          type: 'lf32',
        },
        {
          name: 'type',
          type: 'u8',
        },
        {
          name: 'action',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'add',
                1: 'stop',
              },
            },
          ],
        },
      ],
    ],
    packet_player_fog: [
      'container',
      [
        {
          name: 'stack',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
      ],
    ],
    packet_correct_player_move_prediction: [
      'container',
      [
        {
          name: 'prediction_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'player',
                1: 'vehicle',
              },
            },
          ],
        },
        {
          name: 'position',
          type: 'vec3f',
        },
        {
          name: 'delta',
          type: 'vec3f',
        },
        {
          name: 'vehicle_rotation',
          type: [
            'switch',
            {
              compareTo: 'prediction_type',
              fields: {
                vehicle: [
                  'container',
                  [
                    {
                      name: 'rotation',
                      type: 'vec2f',
                    },
                    {
                      name: 'angular_velocity',
                      type: [
                        'option',
                        'lf32',
                      ],
                    },
                  ],
                ],
              },
            },
          ],
        },
        {
          name: 'on_ground',
          type: 'bool',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_item_registry: [
      'container',
      [
        {
          name: 'items',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'ItemData',
            },
          ],
        },
      ],
    ],
    packet_filter_text_packet: [
      'container',
      [
        {
          name: 'text',
          type: 'string',
        },
        {
          name: 'from_server',
          type: 'bool',
        },
      ],
    ],
    packet_debug_renderer: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'li32',
              mappings: {
                1: 'clear',
                2: 'add_cube',
              },
            },
          ],
        },
        {
          anon: true,
          type: [
            'switch',
            {
              compareTo: 'type',
              fields: {
                clear: 'void',
                add_cube: [
                  'container',
                  [
                    {
                      name: 'text',
                      type: 'string',
                    },
                    {
                      name: 'position',
                      type: 'vec3f',
                    },
                    {
                      name: 'red',
                      type: 'lf32',
                    },
                    {
                      name: 'green',
                      type: 'lf32',
                    },
                    {
                      name: 'blue',
                      type: 'lf32',
                    },
                    {
                      name: 'alpha',
                      type: 'lf32',
                    },
                    {
                      name: 'duration',
                      type: 'li64',
                    },
                  ],
                ],
              },
            },
          ],
        },
      ],
    ],
    packet_sync_entity_property: [
      'container',
      [
        {
          name: 'nbt',
          type: 'nbt',
        },
      ],
    ],
    packet_add_volume_entity: [
      'container',
      [
        {
          name: 'runtime_id',
          type: 'varint64',
        },
        {
          name: 'nbt',
          type: 'nbt',
        },
        {
          name: 'encoding_identifier',
          type: 'string',
        },
        {
          name: 'instance_name',
          type: 'string',
        },
        {
          name: 'bounds',
          type: [
            'container',
            [
              {
                name: 'min',
                type: 'BlockCoordinates',
              },
              {
                name: 'max',
                type: 'BlockCoordinates',
              },
            ],
          ],
        },
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'engine_version',
          type: 'string',
        },
      ],
    ],
    packet_remove_volume_entity: [
      'container',
      [
        {
          name: 'entity_id',
          type: 'varint64',
        },
      ],
    ],
    packet_simulation_type: [
      'container',
      [
        {
          name: 'type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'game',
                1: 'editor',
                2: 'test',
                3: 'invalid',
              },
            },
          ],
        },
      ],
    ],
    packet_npc_dialogue: [
      'container',
      [
        {
          name: 'entity_id',
          type: 'lu64',
        },
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'varint',
              mappings: {
                0: 'open',
                1: 'close',
              },
            },
          ],
        },
        {
          name: 'dialogue',
          type: 'string',
        },
        {
          name: 'screen_name',
          type: 'string',
        },
        {
          name: 'npc_name',
          type: 'string',
        },
        {
          name: 'action_json',
          type: 'string',
        },
      ],
    ],
    packet_edu_uri_resource_packet: [
      'container',
      [
        {
          name: 'resource',
          type: 'EducationSharedResourceURI',
        },
      ],
    ],
    packet_create_photo: [
      'container',
      [
        {
          name: 'entity_unique_id',
          type: 'li64',
        },
        {
          name: 'photo_name',
          type: 'string',
        },
        {
          name: 'item_name',
          type: 'string',
        },
      ],
    ],
    packet_update_subchunk_blocks: [
      'container',
      [
        {
          name: 'x',
          type: 'zigzag32',
        },
        {
          name: 'y',
          type: 'zigzag32',
        },
        {
          name: 'z',
          type: 'zigzag32',
        },
        {
          name: 'blocks',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'BlockUpdate',
            },
          ],
        },
        {
          name: 'extra',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'BlockUpdate',
            },
          ],
        },
      ],
    ],
    packet_photo_info_request: [
      'container',
      [
        {
          name: 'photo_id',
          type: 'zigzag64',
        },
      ],
    ],
    SubChunkEntryWithoutCaching: [
      'array',
      {
        countType: 'lu32',
        type: [
          'container',
          [
            {
              name: 'dx',
              type: 'i8',
            },
            {
              name: 'dy',
              type: 'i8',
            },
            {
              name: 'dz',
              type: 'i8',
            },
            {
              name: 'result',
              type: [
                'mapper',
                {
                  type: 'u8',
                  mappings: {
                    0: 'undefined',
                    1: 'success',
                    2: 'chunk_not_found',
                    3: 'invalid_dimension',
                    4: 'player_not_found',
                    5: 'y_index_out_of_bounds',
                    6: 'success_all_air',
                  },
                },
              ],
            },
            {
              name: 'payload',
              type: 'ByteArray',
            },
            {
              name: 'heightmap_type',
              type: [
                'mapper',
                {
                  type: 'u8',
                  mappings: {
                    0: 'no_data',
                    1: 'has_data',
                    2: 'too_high',
                    3: 'too_low',
                  },
                },
              ],
            },
            {
              name: 'heightmap',
              type: [
                'switch',
                {
                  compareTo: 'heightmap_type',
                  fields: {
                    has_data: [
                      'buffer',
                      {
                        count: 256,
                      },
                    ],
                  },
                },
              ],
            },
          ],
        ],
      },
    ],
    SubChunkEntryWithCaching: [
      'array',
      {
        countType: 'lu32',
        type: [
          'container',
          [
            {
              name: 'dx',
              type: 'i8',
            },
            {
              name: 'dy',
              type: 'i8',
            },
            {
              name: 'dz',
              type: 'i8',
            },
            {
              name: 'result',
              type: [
                'mapper',
                {
                  type: 'u8',
                  mappings: {
                    0: 'undefined',
                    1: 'success',
                    2: 'chunk_not_found',
                    3: 'invalid_dimension',
                    4: 'player_not_found',
                    5: 'y_index_out_of_bounds',
                    6: 'success_all_air',
                  },
                },
              ],
            },
            {
              name: 'payload',
              type: [
                'switch',
                {
                  compareTo: 'result',
                  fields: {
                    success_all_air: 'void',
                  },
                  default: 'ByteArray',
                },
              ],
            },
            {
              name: 'heightmap_type',
              type: [
                'mapper',
                {
                  type: 'u8',
                  mappings: {
                    0: 'no_data',
                    1: 'has_data',
                    2: 'too_high',
                    3: 'too_low',
                  },
                },
              ],
            },
            {
              name: 'heightmap',
              type: [
                'switch',
                {
                  compareTo: 'heightmap_type',
                  fields: {
                    has_data: [
                      'buffer',
                      {
                        count: 256,
                      },
                    ],
                  },
                },
              ],
            },
            {
              name: 'blob_id',
              type: 'lu64',
            },
          ],
        ],
      },
    ],
    packet_subchunk: [
      'container',
      [
        {
          name: 'cache_enabled',
          type: 'bool',
        },
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'origin',
          type: 'vec3i',
        },
        {
          name: 'entries',
          type: [
            'switch',
            {
              compareTo: 'cache_enabled',
              fields: {
                true: 'SubChunkEntryWithCaching',
                false: 'SubChunkEntryWithoutCaching',
              },
            },
          ],
        },
      ],
    ],
    packet_subchunk_request: [
      'container',
      [
        {
          name: 'dimension',
          type: 'zigzag32',
        },
        {
          name: 'origin',
          type: 'vec3i',
        },
        {
          name: 'requests',
          type: [
            'array',
            {
              countType: 'lu32',
              type: [
                'container',
                [
                  {
                    name: 'dx',
                    type: 'i8',
                  },
                  {
                    name: 'dy',
                    type: 'i8',
                  },
                  {
                    name: 'dz',
                    type: 'i8',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_client_start_item_cooldown: [
      'container',
      [
        {
          name: 'category',
          type: 'string',
        },
        {
          name: 'duration',
          type: 'zigzag32',
        },
      ],
    ],
    packet_script_message: [
      'container',
      [
        {
          name: 'message_id',
          type: 'string',
        },
        {
          name: 'data',
          type: 'string',
        },
      ],
    ],
    packet_code_builder_source: [
      'container',
      [
        {
          name: 'operation',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'get',
                2: 'set',
                3: 'reset',
              },
            },
          ],
        },
        {
          name: 'category',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'code_status',
                2: 'instantiation',
              },
            },
          ],
        },
        {
          name: 'code_status',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'none',
                1: 'not_started',
                2: 'in_progress',
                3: 'paused',
                4: 'error',
                5: 'succeeded',
              },
            },
          ],
        },
      ],
    ],
    packet_ticking_areas_load_status: [
      'container',
      [
        {
          name: 'preload',
          type: 'bool',
        },
      ],
    ],
    packet_dimension_data: [
      'container',
      [
        {
          name: 'definitions',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'id',
                    type: 'string',
                  },
                  {
                    name: 'max_height',
                    type: 'zigzag32',
                  },
                  {
                    name: 'min_height',
                    type: 'zigzag32',
                  },
                  {
                    name: 'generator',
                    type: [
                      'mapper',
                      {
                        type: 'zigzag32',
                        mappings: {
                          0: 'legacy',
                          1: 'overworld',
                          2: 'flat',
                          3: 'nether',
                          4: 'end',
                          5: 'void',
                        },
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_agent_action: [
      'container',
      [
        {
          name: 'request_id',
          type: 'string',
        },
        {
          name: 'action_type',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'attack',
                2: 'collect',
                3: 'destroy',
                4: 'detect_redstone',
                5: 'detect_obstacle',
                6: 'drop',
                7: 'drop_all',
                8: 'inspect',
                9: 'inspect_data',
                10: 'inspect_item_count',
                11: 'inspect_item_detail',
                12: 'inspect_item_space',
                13: 'interact',
                14: 'move',
                15: 'place_block',
                16: 'till',
                17: 'transfer_item_to',
                18: 'turn',
              },
            },
          ],
        },
        {
          name: 'body',
          type: 'string',
        },
      ],
    ],
    packet_change_mob_property: [
      'container',
      [
        {
          name: 'entity_unique_id',
          type: 'zigzag64',
        },
        {
          name: 'property',
          type: 'string',
        },
        {
          name: 'bool_value',
          type: 'bool',
        },
        {
          name: 'string_value',
          type: 'string',
        },
        {
          name: 'int_value',
          type: 'zigzag32',
        },
        {
          name: 'float_value',
          type: 'lf32',
        },
      ],
    ],
    packet_lesson_progress: [
      'container',
      [
        {
          name: 'action',
          type: 'u8',
        },
        {
          name: 'score',
          type: 'zigzag32',
        },
        {
          name: 'identifier',
          type: 'string',
        },
      ],
    ],
    packet_request_ability: [
      'container',
      [
        {
          name: 'ability',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'build',
                1: 'mine',
                2: 'doors_and_switches',
                3: 'open_containers',
                4: 'attack_players',
                5: 'attack_mobs',
                6: 'operator_commands',
                7: 'teleport',
                8: 'invulnerable',
                9: 'flying',
                10: 'may_fly',
                11: 'instant_build',
                12: 'lightning',
                13: 'fly_speed',
                14: 'walk_speed',
                15: 'muted',
                16: 'world_builder',
                17: 'no_clip',
                18: 'ability_count',
              },
            },
          ],
        },
        {
          name: 'value_type',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                1: 'bool',
                2: 'float',
              },
            },
          ],
        },
        {
          name: 'bool_value',
          type: 'bool',
        },
        {
          name: 'float_val',
          type: 'lf32',
        },
      ],
    ],
    packet_request_permissions: [
      'container',
      [
        {
          name: 'entity_unique_id',
          type: 'li64',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'requested_permissions',
          type: 'RequestPermissions',
        },
      ],
    ],
    RequestPermissions: [
      'bitflags',
      {
        type: 'lu16',
        flags: {
          build: 1,
          mine: 2,
          doors_and_switches: 4,
          open_containers: 8,
          attack_players: 16,
          attack_mobs: 32,
          operator: 64,
          teleport: 128,
        },
      },
    ],
    packet_toast_request: [
      'container',
      [
        {
          name: 'title',
          type: 'string',
        },
        {
          name: 'message',
          type: 'string',
        },
      ],
    ],
    packet_update_abilities: [
      'container',
      [
        {
          name: 'entity_unique_id',
          type: 'li64',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'command_permission',
          type: 'CommandPermissionLevel',
        },
        {
          name: 'abilities',
          type: [
            'array',
            {
              countType: 'u8',
              type: 'AbilityLayers',
            },
          ],
        },
      ],
    ],
    packet_update_adventure_settings: [
      'container',
      [
        {
          name: 'no_pvm',
          type: 'bool',
        },
        {
          name: 'no_mvp',
          type: 'bool',
        },
        {
          name: 'immutable_world',
          type: 'bool',
        },
        {
          name: 'show_name_tags',
          type: 'bool',
        },
        {
          name: 'auto_jump',
          type: 'bool',
        },
      ],
    ],
    packet_death_info: [
      'container',
      [
        {
          name: 'cause',
          type: 'string',
        },
        {
          name: 'messages',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
      ],
    ],
    packet_editor_network: [
      'container',
      [
        {
          name: 'route_to_manager',
          type: 'bool',
        },
        {
          name: 'payload',
          type: 'nbt',
        },
      ],
    ],
    packet_feature_registry: [
      'container',
      [
        {
          name: 'features',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'name',
                    type: 'string',
                  },
                  {
                    name: 'options',
                    type: 'string',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_server_stats: [
      'container',
      [
        {
          name: 'server_time',
          type: 'lf32',
        },
        {
          name: 'network_time',
          type: 'lf32',
        },
      ],
    ],
    packet_request_network_settings: [
      'container',
      [
        {
          name: 'client_protocol',
          type: 'i32',
        },
      ],
    ],
    packet_game_test_request: [
      'container',
      [
        {
          name: 'max_tests_per_batch',
          type: 'varint',
        },
        {
          name: 'repetitions',
          type: 'varint',
        },
        {
          name: 'rotation',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: '0deg',
                1: '90deg',
                2: '180deg',
                3: '270deg',
                4: '360deg',
              },
            },
          ],
        },
        {
          name: 'stop_on_error',
          type: 'bool',
        },
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'tests_per_row',
          type: 'varint',
        },
        {
          name: 'name',
          type: 'string',
        },
      ],
    ],
    packet_game_test_results: [
      'container',
      [
        {
          name: 'succeeded',
          type: 'bool',
        },
        {
          name: 'error',
          type: 'string',
        },
        {
          name: 'name',
          type: 'string',
        },
      ],
    ],
    InputLockFlags: [
      'bitflags',
      {
        type: 'varint',
        flags: {
          move: 2,
          jump: 4,
          sneak: 8,
          mount: 16,
          dismount: 32,
          rotation: 64,
        },
      },
    ],
    packet_update_client_input_locks: [
      'container',
      [
        {
          name: 'locks',
          type: 'InputLockFlags',
        },
        {
          name: 'position',
          type: 'vec3f',
        },
      ],
    ],
    packet_client_cheat_ability: [
      'container',
      [
        {
          name: 'entity_unique_id',
          type: 'li64',
        },
        {
          name: 'permission_level',
          type: 'PermissionLevel',
        },
        {
          name: 'command_permission',
          type: 'CommandPermissionLevel',
        },
        {
          name: 'abilities',
          type: [
            'array',
            {
              countType: 'u8',
              type: 'AbilityLayers',
            },
          ],
        },
      ],
    ],
    packet_camera_presets: [
      'container',
      [
        {
          name: 'presets',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'CameraPresets',
            },
          ],
        },
      ],
    ],
    packet_unlocked_recipes: [
      'container',
      [
        {
          name: 'unlock_type',
          type: [
            'mapper',
            {
              type: 'lu32',
              mappings: {
                0: 'empty',
                1: 'initially_unlocked',
                2: 'newly_unlocked',
                3: 'remove_unlocked',
                4: 'remove_all_unlocked',
              },
            },
          ],
        },
        {
          name: 'recipes',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'string',
            },
          ],
        },
      ],
    ],
    packet_camera_instruction: [
      'container',
      [
        {
          name: 'instruction_set',
          type: [
            'option',
            [
              'container',
              [
                {
                  name: 'runtime_id',
                  type: 'li32',
                },
                {
                  name: 'ease_data',
                  type: [
                    'option',
                    [
                      'container',
                      [
                        {
                          name: 'type',
                          type: [
                            'mapper',
                            {
                              type: 'u8',
                              mappings: {
                                0: 'Linear',
                                1: 'Spring',
                                2: 'InQuad',
                                3: 'OutQuad',
                                4: 'InOutQuad',
                                5: 'InCubic',
                                6: 'OutCubic',
                                7: 'InOutCubic',
                                8: 'InQuart',
                                9: 'OutQuart',
                                10: 'InOutQuart',
                                11: 'InQuint',
                                12: 'OutQuint',
                                13: 'InOutQuint',
                                14: 'InSine',
                                15: 'OutSine',
                                16: 'InOutSine',
                                17: 'InExpo',
                                18: 'OutExpo',
                                19: 'InOutExpo',
                                20: 'InCirc',
                                21: 'OutCirc',
                                22: 'InOutCirc',
                                23: 'InBounce',
                                24: 'OutBounce',
                                25: 'InOutBounce',
                                26: 'InBack',
                                27: 'OutBack',
                                28: 'InOutBack',
                                29: 'InElastic',
                                30: 'OutElastic',
                                31: 'InOutElastic',
                              },
                            },
                          ],
                        },
                        {
                          name: 'duration',
                          type: 'lf32',
                        },
                      ],
                    ],
                  ],
                },
                {
                  name: 'position',
                  type: [
                    'option',
                    'vec3f',
                  ],
                },
                {
                  name: 'rotation',
                  type: [
                    'option',
                    'vec2f',
                  ],
                },
                {
                  name: 'facing',
                  type: [
                    'option',
                    'vec3f',
                  ],
                },
                {
                  name: 'offset',
                  type: [
                    'option',
                    'vec2f',
                  ],
                },
                {
                  name: 'entity_offset',
                  type: [
                    'option',
                    'vec3f',
                  ],
                },
                {
                  name: 'default',
                  type: [
                    'option',
                    'bool',
                  ],
                },
              ],
            ],
          ],
        },
        {
          name: 'clear',
          type: [
            'option',
            'bool',
          ],
        },
        {
          name: 'fade',
          type: [
            'option',
            [
              'container',
              [
                {
                  name: 'fade_in_duration',
                  type: 'lf32',
                },
                {
                  name: 'wait_duration',
                  type: 'lf32',
                },
                {
                  name: 'fade_out_duration',
                  type: 'lf32',
                },
                {
                  name: 'color_rgb',
                  type: 'vec3f',
                },
              ],
            ],
          ],
        },
        {
          name: 'target',
          type: [
            'option',
            [
              'container',
              [
                {
                  name: 'offset',
                  type: [
                    'option',
                    'vec3f',
                  ],
                },
                {
                  name: 'entity_unique_id',
                  type: 'li64',
                },
              ],
            ],
          ],
        },
        {
          name: 'remove_target',
          type: [
            'option',
            'bool',
          ],
        },
      ],
    ],
    packet_compressed_biome_definitions: [
      'container',
      [
        {
          name: 'raw_payload',
          type: 'ByteArray',
        },
      ],
    ],
    packet_trim_data: [
      'container',
      [
        {
          name: 'patterns',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'item_name',
                    type: 'string',
                  },
                  {
                    name: 'pattern',
                    type: 'string',
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'materials',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'material',
                    type: 'string',
                  },
                  {
                    name: 'color',
                    type: 'string',
                  },
                  {
                    name: 'item_name',
                    type: 'string',
                  },
                ],
              ],
            },
          ],
        },
      ],
    ],
    packet_open_sign: [
      'container',
      [
        {
          name: 'position',
          type: 'BlockCoordinates',
        },
        {
          name: 'is_front',
          type: 'bool',
        },
      ],
    ],
    packet_agent_animation: [
      'container',
      [
        {
          name: 'animation',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'arm_swing',
                1: 'shrug',
              },
            },
          ],
        },
        {
          name: 'entity_runtime_id',
          type: 'varint64',
        },
      ],
    ],
    packet_refresh_entitlements: [
      'container',
      [],
    ],
    packet_toggle_crafter_slot_request: [
      'container',
      [
        {
          name: 'position',
          type: 'vec3li',
        },
        {
          name: 'slot',
          type: 'u8',
        },
        {
          name: 'disabled',
          type: 'bool',
        },
      ],
    ],
    packet_set_player_inventory_options: [
      'container',
      [
        {
          name: 'left_tab',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'construction',
                2: 'equipment',
                3: 'items',
                4: 'nature',
                5: 'search',
                6: 'survival',
              },
            },
          ],
        },
        {
          name: 'right_tab',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'fullscreen',
                2: 'crafting',
                3: 'armor',
              },
            },
          ],
        },
        {
          name: 'filtering',
          type: 'bool',
        },
        {
          name: 'layout',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'survival',
                2: 'recipe_book',
                3: 'creative',
              },
            },
          ],
        },
        {
          name: 'crafting_layout',
          type: [
            'mapper',
            {
              type: 'zigzag32',
              mappings: {
                0: 'none',
                1: 'survival',
                2: 'recipe_book',
                3: 'creative',
              },
            },
          ],
        },
      ],
    ],
    packet_set_hud: [
      'container',
      [
        {
          name: 'elements',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'Element',
            },
          ],
        },
        {
          name: 'visibility',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'hide',
                1: 'reset',
              },
            },
          ],
        },
      ],
    ],
    Element: [
      'mapper',
      {
        type: 'u8',
        mappings: {
          0: 'PaperDoll',
          1: 'Armour',
          2: 'ToolTips',
          3: 'TouchControls',
          4: 'Crosshair',
          5: 'HotBar',
          6: 'Health',
          7: 'ProgressBar',
          8: 'Hunger',
          9: 'AirBubbles',
          10: 'VehicleHealth',
          11: 'EffectsBar',
          12: 'ItemTextPopup',
        },
      },
    ],
    packet_award_achievement: [
      'container',
      [
        {
          name: 'achievement_id',
          type: 'li32',
        },
      ],
    ],
    packet_server_post_move: [
      'container',
      [
        {
          name: 'position',
          type: 'vec3f',
        },
      ],
    ],
    packet_clientbound_close_form: [
      'container',
      [],
    ],
    packet_serverbound_loading_screen: [
      'container',
      [
        {
          name: 'type',
          type: 'zigzag32',
        },
        {
          name: 'loading_screen_id',
          type: [
            'option',
            'lu32',
          ],
        },
      ],
    ],
    packet_jigsaw_structure_data: [
      'container',
      [
        {
          name: 'structure_data',
          type: 'nbt',
        },
      ],
    ],
    packet_current_structure_feature: [
      'container',
      [
        {
          name: 'current_feature',
          type: 'string',
        },
      ],
    ],
    packet_serverbound_diagnostics: [
      'container',
      [
        {
          name: 'average_frames_per_second',
          type: 'lf32',
        },
        {
          name: 'average_server_sim_tick_time',
          type: 'lf32',
        },
        {
          name: 'average_client_sim_tick_time',
          type: 'lf32',
        },
        {
          name: 'average_begin_frame_time',
          type: 'lf32',
        },
        {
          name: 'average_input_time',
          type: 'lf32',
        },
        {
          name: 'average_render_time',
          type: 'lf32',
        },
        {
          name: 'average_end_frame_time',
          type: 'lf32',
        },
        {
          name: 'average_remainder_time_percent',
          type: 'lf32',
        },
        {
          name: 'average_unaccounted_time_percent',
          type: 'lf32',
        },
      ],
    ],
    packet_camera_aim_assist: [
      'container',
      [
        {
          name: 'preset_id',
          type: 'string',
        },
        {
          name: 'view_angle',
          type: 'vec2f',
        },
        {
          name: 'distance',
          type: 'lf32',
        },
        {
          name: 'target_mode',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'angle',
                1: 'distance',
              },
            },
          ],
        },
        {
          name: 'action',
          type: 'CameraAimAssistAction',
        },
      ],
    ],
    packet_container_registry_cleanup: [
      'container',
      [
        {
          name: 'removed_containers',
          type: [
            'array',
            {
              countType: 'varint',
              type: 'FullContainerName',
            },
          ],
        },
      ],
    ],
    packet_movement_effect: [
      'container',
      [
        {
          name: 'runtime_id',
          type: 'varint64',
        },
        {
          name: 'effect_type',
          type: 'MovementEffectType',
        },
        {
          name: 'effect_duration',
          type: 'varint',
        },
        {
          name: 'tick',
          type: 'varint64',
        },
      ],
    ],
    packet_set_movement_authority: [
      'container',
      [
        {
          name: 'movement_authority',
          type: [
            'mapper',
            {
              type: 'u8',
              mappings: {
                0: 'client',
                1: 'server',
                2: 'server_with_rewind',
              },
            },
          ],
        },
      ],
    ],
    packet_camera_aim_assist_presets: [
      'container',
      [
        {
          name: 'category_groups',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'id',
                    type: 'string',
                  },
                  {
                    name: 'categories',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'container',
                          [
                            {
                              name: 'name',
                              type: 'string',
                            },
                            {
                              name: 'priorities',
                              type: [
                                'container',
                                [
                                  {
                                    name: 'entities',
                                    type: [
                                      'array',
                                      {
                                        countType: 'varint',
                                        type: [
                                          'container',
                                          [
                                            {
                                              name: 'id',
                                              type: 'string',
                                            },
                                            {
                                              name: 'priority',
                                              type: 'li32',
                                            },
                                          ],
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    name: 'blocks',
                                    type: [
                                      'array',
                                      {
                                        countType: 'varint',
                                        type: [
                                          'container',
                                          [
                                            {
                                              name: 'id',
                                              type: 'string',
                                            },
                                            {
                                              name: 'priority',
                                              type: 'li32',
                                            },
                                          ],
                                        ],
                                      },
                                    ],
                                  },
                                  {
                                    name: 'entity_default',
                                    type: [
                                      'option',
                                      'li32',
                                    ],
                                  },
                                  {
                                    name: 'block_default',
                                    type: [
                                      'option',
                                      'li32',
                                    ],
                                  },
                                ],
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'presets',
          type: [
            'array',
            {
              countType: 'varint',
              type: [
                'container',
                [
                  {
                    name: 'id',
                    type: 'string',
                  },
                  {
                    name: 'categories',
                    type: 'string',
                  },
                  {
                    name: 'exclude_blocks',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: 'string',
                      },
                    ],
                  },
                  {
                    name: 'target_liquids',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: 'string',
                      },
                    ],
                  },
                  {
                    name: 'item_settings',
                    type: [
                      'array',
                      {
                        countType: 'varint',
                        type: [
                          'container',
                          [
                            {
                              name: 'id',
                              type: 'string',
                            },
                            {
                              name: 'category',
                              type: 'string',
                            },
                          ],
                        ],
                      },
                    ],
                  },
                  {
                    name: 'default_item_settings',
                    type: [
                      'option',
                      'string',
                    ],
                  },
                  {
                    name: 'hand_settings',
                    type: [
                      'option',
                      'string',
                    ],
                  },
                ],
              ],
            },
          ],
        },
        {
          name: 'operation',
          type: 'u8',
        },
      ],
    ],
    packet_client_camera_aim_assist: [
      'container',
      [
        {
          name: 'preset_id',
          type: 'string',
        },
        {
          name: 'action',
          type: 'CameraAimAssistAction',
        },
        {
          name: 'allow_aim_assist',
          type: 'bool',
        },
      ],
    ],
    packet_client_movement_prediction_sync: [
      'container',
      [
        {
          name: 'data_flags',
          type: 'varint128',
        },
        {
          name: 'bounding_box',
          type: 'EntityBoundingBoxComponent',
        },
        {
          name: 'movement_attributes',
          type: 'MovementAttributesComponent',
        },
        {
          name: 'entity_unique_id',
          type: 'varint64',
        },
      ],
    ],
  },
}