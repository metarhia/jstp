#ifndef SRC_COMMON_H_
#define SRC_COMMON_H_

#define THROW_EXCEPTION(ex_type, ex_msg)                                       \
  isolate->ThrowException(v8::Exception::ex_type(                              \
      v8::String::NewFromUtf8(isolate, ex_msg)))

#endif  // SRC_COMMON_H_
