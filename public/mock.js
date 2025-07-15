var mock = {
  // 获取表格数据
  getTableData: param => {
    console.log("mock: getTableData param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const size = param.pageSize ? param.pageSize : 10;
        const data = Array.from({ length: size }, (_, key) => ({
          id: key,
          name: `name_${key}`,
          nickname: `nickname_${key}`,
          age: Math.ceil(Math.random() * 60),
          sex: Math.ceil(Math.random() * 2)
        }));
        const json = {
          code: 0,
          data: {
            data: data,
            total: 100
          }
        };
        console.log("mock: getTableData return", json);
        resolve(json);
      });
    });
  },
  // 根据id获取详情数据
  getInfoById: param => {
    console.log("mock: getInfoById param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const data = {
          id: param.id,
          name: `name_${param.id}`,
          nickname: `nickname_${param.id}`,
          age: Math.ceil(Math.random() * 60),
          sex: Math.ceil(Math.random() * 2)
        };
        const json = {
          code: 0,
          data: data
        };
        console.log("mock: getInfoById return", json);
        resolve(json);
      });
    });
  },
  //获取表格头部数据
  getTableColumns: param => {
    console.log("mock: getTableColumns param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const data = [
          {
            field: "name",
            title: "Name"
          },
          {
            field: "sex",
            title: "Sex"
          },
          {
            field: "age",
            title: "Age"
          }
        ];
        const json = {
          code: 0,
          data: {
            data: data,
            total: 100
          }
        };
        console.log("mock: getTableColumns return", json);
        resolve(json);
      });
    });
  },
  //获取下拉数据
  getSelectData: param => {
    console.log("mock: getSelectData param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const data = [
          {
            id: 1,
            name: "男"
          },
          {
            id: 2,
            name: "女"
          }
        ];
        const json = {
          code: 0,
          data: {
            data: data,
            total: 100
          }
        };
        console.log("mock: getSelectData return", json);
        resolve(json);
      });
    });
  },
  // 获取树形数据
  getTreeData: param => {
    console.log("mock: getTreeData param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const data = [
          {
            value: "zhejiang",
            label: "Zhejiang",
            children: [
              {
                value: "hangzhou",
                label: "Hangzhou",
                children: [
                  {
                    value: "xihu",
                    label: "West Lake"
                  }
                ]
              }
            ]
          },
          {
            value: "jiangsu",
            label: "Jiangsu",
            children: [
              {
                value: "nanjing",
                label: "Nanjing",
                children: [
                  {
                    value: "zhonghuamen",
                    label: "Zhong Hua Men"
                  }
                ]
              }
            ]
          }
        ];
        const json = {
          code: 0,
          data: {
            data: data,
            total: 100
          }
        };
        console.log("mock: getTreeData return", json);
        resolve(json);
      });
    });
  },
  // 保存数据
  saveData: param => {
    console.log("mock: saveData param", param);
    return new Promise(resolve => {
      setTimeout(() => {
        const json = {
          code: 0,
          data: ""
        };
        console.log("mock: saveData return", json);
        resolve(json);
      });
    });
  }
};
