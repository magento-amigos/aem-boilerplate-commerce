/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as i}from"@dropins/tools/fetch-graphql.js";const{setEndpoint:l,setFetchGraphQlHeader:C,removeFetchGraphQlHeader:y,setFetchGraphQlHeaders:E,fetchGraphQl:m,getConfig:p}=new i().getMethods(),u=`
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
`,n={currentCompany:null,customerCompanies:[]},h=e=>({text:e.name,value:e.id}),d=()=>{var o;return!!((o=p().fetchGraphQlHeaders)!=null&&o.Authorization)},G=async()=>{var e,o;if(!d())return n;try{const t=await m(u);if(!(t!=null&&t.data))return console.error("Invalid GraphQL response structure"),n;const a=t.data,s=a.company,r=a.customer,c=((o=(e=r==null?void 0:r.companies)==null?void 0:e.items)==null?void 0:o.map(h))||[];return{currentCompany:s,customerCompanies:c}}catch(t){return console.error("Failed to fetch customer company information:",t),n}};export{C as a,E as b,p as c,m as f,G as g,y as r,l as s};
//# sourceMappingURL=customerCompanies.js.map
