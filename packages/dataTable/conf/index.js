const GlobalConfig = {
  pagerConfig: { 
    pageSize: 20,
    layouts:['PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total'],
    perfect:true,
    props:{
      pageSize:'pageSize',
      currentPage:'pageIndex'
    }
  },
}

export default GlobalConfig
