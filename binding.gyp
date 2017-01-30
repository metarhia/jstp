{
  'variables': {
    'jstp_base_cflags': ['-Wall', '-Wextra', '-Wno-unused-parameter'],
    'jstp_debug_cflags': ['-g', '-O0'],
    'jstp_release_cflags': ['-O3']
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
          'cflags': ['<@(jstp_debug_cflags)'],
          'xcode_settings': {
            'OTHER_CFLAGS': ['<@(jstp_debug_cflags)']
          }
        },
        'Release': {
          'cflags': ['<@(jstp_release_cflags)'],
          'xcode_settings': {
            'OTHER_CFLAGS': ['<@(jstp_release_cflags)']
          }
        }
      },
      'cflags': ['<@(jstp_base_cflags)'],
      'xcode_settings': {
        'OTHER_CFLAGS': ['<@(jstp_base_cflags)']
      }
    }
  ]
}
