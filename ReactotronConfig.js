import {reactotronRedux} from 'reactotron-redux';
import Reactotron, {asyncStorage, networking} from 'reactotron-react-native';

const reactotron = Reactotron.configure({name: 'EDA - Time Tracker'})
  .use(reactotronRedux())
  .use(asyncStorage())
  .use(networking())
  .connect();
export default reactotron;
