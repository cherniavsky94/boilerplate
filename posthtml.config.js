import include from 'posthtml-include';
import extend from 'posthtml-extend';
import expressions from 'posthtml-expressions';
import components from 'posthtml-components';
import bem from 'posthtml-bem';

export default {
  plugins: [
    include({ root: 'src' }),
    extend({ root: 'src' }),
    expressions({
      // Добавьте ваши переменные/локали при необходимости
      // locals: { env: process.env.NODE_ENV }
    }),
    components({
      // По умолчанию можно хранить компоненты в src/components
      // components: 'src/components'
    }),
    bem(),
  ],
  options: {
    recognizeSelfClosing: true,
  },
};
