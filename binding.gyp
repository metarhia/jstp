{
  'variables': {
    'jstp_base_ccflags': [
      '-Wall',
      '-Wextra',
      '-Wno-unused-parameter',
      '-std=c++11'
    ],
    'jstp_debug_ccflags': ['-g', '-O0'],
    'jstp_release_ccflags': ['-O3']
  },
  'targets': [
    {
      'target_name': 'jstp',
      'sources': [
        'src/node_bindings.cc',
        'src/jsrs_serializer.cc',
        'src/jsrs_parser.cc',
        'src/packet_parser.cc',
        'src/unicode_utils.cc'
      ],
      'configurations': {
        'Debug': {
          'cflags_cc': ['<@(jstp_debug_ccflags)'],
          'xcode_settings': {
            'OTHER_CPLUSPLUSFLAGS': ['<@(jstp_debug_ccflags)']
          }
        },
        'Release': {
          'cflags_cc': ['<@(jstp_release_ccflags)'],
          'xcode_settings': {
            'OTHER_CPLUSPLUSFLAGS': ['<@(jstp_release_ccflags)']
          }
        }
      },
      'cflags_cc': ['<@(jstp_base_ccflags)'],
      'xcode_settings': {
        'OTHER_CPLUSPLUSFLAGS': ['<@(jstp_base_ccflags)']
      }
    }
  ]
}
