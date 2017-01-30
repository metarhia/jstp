{
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
          'cflags': ['-g', '-O0'],
          'xcode_settings': {
            'OTHER_CFLAGS': ['-g', '-O0']
          }
        },
        'Release': {
          'cflags': ['-O3'],
          'xcode_settings': {
            'OTHER_CFLAGS': ['-O3']
          }
        }
      },
      'cflags': ['-Wall', '-Wextra', '-Wno-unused-parameter'],
      'xcode_settings': {
        'OTHER_CFLAGS': ['-Wall', '-Wextra', '-Wno-unused-parameter']
      }
    }
  ]
}
