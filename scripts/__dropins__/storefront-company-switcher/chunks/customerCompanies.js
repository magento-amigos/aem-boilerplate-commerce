/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as c}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:f,setFetchGraphQlHeader:l,removeFetchGraphQlHeader:C,setFetchGraphQlHeaders:y,fetchGraphQl:i,getConfig:m}=new c().getMethods(),p=`
  query GET_CUSTOMER_COMPANIES {
    customer {
      companies {
        items {
          name
          id
        }
      }
    }
    company {
      name
      id
    }
  }
`,a={currentCompany:null,customerCompanies:[]},u=t=>({text:t.name,value:t.id}),h=()=>{var o;return!!((o=m().fetchGraphQlHeaders)!=null&&o.Authorization)},E=async()=>{var t,o;if(!h())return a;try{const e=await i(p);if(!(e!=null&&e.data))return console.error("Invalid GraphQL response structure"),a;const n=e.data.company,r=e.data.customer,s=((o=(t=r==null?void 0:r.companies)==null?void 0:t.items)==null?void 0:o.map(u))||[];return{currentCompany:n,customerCompanies:s}}catch(e){return console.error("Failed to fetch customer company information:",e),a}};export{l as a,y as b,m as c,i as f,E as g,C as r,f as s};
//# sourceMappingURL=customerCompanies.js.map
