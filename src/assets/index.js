const datas = {
  nodes: [{
    src_ip: "222.11.22.33",
    dst_ip: "192.168.1.10",
    date: "2018-07-11 11:00:10",
    type: "非法登录",
    source: "snort_30281",
    number: "NAS-030101",
    name: "SQL注入",
    
    id: 0
  }, {
    src_ip: "222.11.22.33",
    dst_ip: "192.168.1.10",
    date: "2018-07-11 11:00:20",
    type: "非法登录",
    source: "snort_30281",
    number: "NAS-030101",
    name: "非法登录",
    id: 1
  }],
  links: [{
    source:0,
    target:1
  }]
}
