import {logProfileData} from 'react-native-calendars/src/Profiler';
import {Constants} from '../../Config';
import {Tools} from '../../Helpers';
import Ajax from './base';

const BASE_URL = Constants.IS_DEVELOPING_MODE
  ? Constants.BASE_URL.DEV
  : Constants.BASE_URL.PROD;

export default {
  DailyList: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/daily-lists/settings/list', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  deleteDailyListItem: params => {
    console.log(params, '-----------------param');
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    console.log(formData, 'jjsgdhjdfgf');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/destroy/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  Customers: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/customers', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  Locations: params => {
    console.log(params, '-----------------param');
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(`https://das4you.mhcode.pl/api/locations/${params.itemId}`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'multipart/form-data',
      },
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== DAILYLIST SAVE SERVICE ==============================

  SaveData: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/daily-lists/settings/create', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== TYPE SERVICES SERVICE ==============================

  Services: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/service-types', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CONTAINER SERVICES SERVICE ==============================

  ContainerServiceType: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/container-work-types', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== GOOD TYPE SERVICE ==============================
  GoodType: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/goods-types', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CONTAINER SIZE SERVICE ==============================

  ContainerSize: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/container-sizes', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CREATE 1 SERVICE ==============================

  Create1: params => {
    console.log(params, '...........>>>>>>>>>>>>>>>>>>>>>...........params');
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    formData.append('container_work_type', params.container_work_type);
    formData.append('container_no1', params.container_no1);
    formData.append('container_no2', params.container_no2);
    formData.append('container_no3', params.container_no3);
    formData.append('container_no4', params.container_no4);
    formData.append('container_no5', params.container_no4);
    formData.append('container_no6', params.container_no6);
    formData.append('container_no7', params.container_no7);
    formData.append('container_no8', params.container_no8);
    formData.append('container_no9', params.container_no9);
    formData.append('container_no10', params.container_no10);
    formData.append('container_no11', params.container_no11);
    formData.append(
      'cardboards_number_in_items',
      params.cardboards_number_in_items,
    );
    formData.append('sorts_number_in_items', params.sorts_number_in_items);
    formData.append('type_of_goods', params.type_of_goods);
    formData.append('type_of_container', params.type_of_container);
    formData.append('note', params.note);
    // Append each worker's ID and note individually
    params.workers.forEach((worker, index) => {
      formData.append(`workers[${index}][id]`, worker.id);
      formData.append(`workers[${index}][note]`, worker.note);
    });

    console.log(
      formData,
      '........>>>>>>>>>>>>...........formdata',
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
    );
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CREATE 2 SERVICE ==============================

  Create2: params => {
    console.log(params, '...........>>>>>>>>>>>>>>>>>>>>>...........params');
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    formData.append('set_number', params.set_number);
    formData.append('set_type', params.set_type);
    formData.append('note', params.note);
    formData.append('number_of_items', params.number_of_items);
    // Append each worker's ID and note individually
    params.workers.forEach((worker, index) => {
      formData.append(`workers[${index}][id]`, worker.id);
      formData.append(`workers[${index}][note]`, worker.note);
    });

    console.log(formData, '........>>>>>>>>>>>>...........formdata');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CREATE 3 SERVICE ==============================

  Create3: params => {
    console.log(params, '...........>>>>>>>>>>>>>>>>>>>>>...........params');
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    formData.append('number_of_items', params.number_of_items);
    params.workers.forEach((worker, index) => {
      formData.append(`workers[${index}][id]`, worker.id);
      formData.append(`workers[${index}][note]`, worker.note);
    });
    console.log(formData, '........>>>>>>>>>>>>...........formdata');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== CREATE 4 SERVICE ==============================

  Create4: params => {
    console.log(
      params,
      '...........>>>>>>>>>>>>>>>>>>>>>...........params for Repacking',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    formData.append('number_of_items', params.number_of_items);
    params.workers.forEach((worker, index) => {
      formData.append(`workers[${index}][id]`, worker.id);
      formData.append(`workers[${index}][note]`, worker.note);
    });
    console.log(
      formData,
      '........>>>>>>>>>>>>...........formdata for repacking pallet',
    );
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
  //=============================== CREATE 5 SERVICE ==============================

  Create5: params => {
    console.log(
      params,
      '...........>>>>>>>>>>>>>>>>>>>>>...........params for warteziet',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    formData.append('begin_hour', params.begin_hour);
    formData.append('end_hour', params.end_hour);

    // Append each worker's ID and note individually
    params.workers.forEach((worker, index) => {
      formData.append(`workers[${index}][id]`, worker.id);
      formData.append(`workers[${index}][note]`, worker.note);
    });

    console.log(
      formData,
      '........>>>>>>>>>>>>...........formdata for repacking pallet',
    );
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
  //=============================== CREATE 6 SERVICE ==============================

  Create6: params => {
    console.log(
        params.blocks,
        '...........>>>>>>>>>>>>>>>>>>>>>...........params for stundenarbeit',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('service_type_id', params.service_type_id);
    params.blocks.forEach((block, index) => {
        formData.append(`workers[${index}][begin_hour]`, block.startTime);
        formData.append(`workers[${index}][end_hour]`, block.endTime);
        formData.append(`workers[${index}][id]`, block.workerId);
        formData.append(`workers[${index}][note]`, block.workerNote);
    });

    console.log(
        formData,
        '........>>>>>>>>>>>>...........formdata for repacking pallet',
    );
    return fetch(
        `https://das4you.mhcode.pl/api/daily-lists/create/${params.itemId}`,
        {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'multipart/form-data',
            },
        },
    )
    .then(response => Ajax.handleResponse(response))
    .then(data => {
        return data;
    });
},

  //=============================== Worker SERVICE ==============================

  workers: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/workers', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== SET TYPES SERVICE ==============================

  setTypes: params => {
    let header = {
      Accept: 'multipart/form-data',
    };
    return fetch('https://das4you.mhcode.pl/api/set-types', {
      method: 'POST',
      body: params,
    })
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== SETTING INFO SERVICE ==============================

  settingInfoTypes: params => {
    console.log(
      params.itemId,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/info/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== SETTING INFO DELETE SERVICE ==============================

  settingInfoDeleteTypes: params => {
    console.log(
      `https://das4you.mhcode.pl/api/daily-lists/destroy/${params.itemId}`,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/destroy/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== PDF SERVICE ==============================

  pdf: params => {
    console.log(
      params.itemId,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/pdf/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== EDIT SAVE SERVICE ==============================

  editSave: params => {
    console.log(
      params.itemId,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/pdf/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== FINISHED LIST SERVICE ==============================

  finished: params => {
    console.log(
      params.itemId,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/finish/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== UPLOAD IMAGES SERVICE ==============================

upload : params => {
    console.log(
      params,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('file', {
      uri: params.file[0].uri,
      name: params.file[0].filename,
      type: 'image/jpg', 
    });
    console.log(formData, 'formData');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/upload-file/${params.positionId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== UPLOAD IMAGES SERVICE ==============================

  uploadRemove : params => {
    console.log(
      params,
      'uplodremoveuploadremove',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/remove-file/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },



  //=============================== FILES SERVICE ==============================

  file : params => {
    console.log(
      params,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    console.log(formData, 'formData');
    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/files/${params.positionId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },

  //=============================== EDIT1 SAVE SERVICE ==============================

  edit1Save: params => {
    console.log(
      params.date,
      'settingInfoTypessettingInfoTypessettingInfoTypes',
    );
    let formData = new FormData();
    formData.append('session_id', params?.session_id);
    formData.append('device_id', '123');
    formData.append('date', params.date);
    formData.append('customer_id',params.customerId);
    formData.append('location_id',params.locationId);
 
    formData.append('on_time','');
    formData.append('rating1','');
    formData.append('rating2','');
    formData.append('rating3','');
    formData.append('rating4','');

    return fetch(
      `https://das4you.mhcode.pl/api/daily-lists/settings/edit/${params.itemId}`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'multipart/form-data',
        },
      },
    )
      .then(response => Ajax.handleResponse(response))
      .then(data => {
        return data;
      });
  },
};