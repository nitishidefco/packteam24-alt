module.exports = {
    assets: ['./src/Assets/Fonts'],
    codegenConfig: {
      libraries: [
        {
          name: 'NativeElapsedTime',
          jsSrcsDir: 'spec',
          ios: {
            libraryName: 'NativeElapsedTime',
          },
        },
      ],
    },
  };