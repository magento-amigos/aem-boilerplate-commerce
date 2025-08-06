/*! Copyright 2025 Adobe
All Rights Reserved. */
import{FetchGraphQL as t}from"@dropins/tools/fetch-graphql.js";import{f as h,g as d,c,r as m,s as g,a as f,b as u,u as G}from"./chunks/updateCompany.js";import"@dropins/tools/event-bus.js";const{setEndpoint:o,setFetchGraphQlHeader:r,setFetchGraphQlHeaders:n}=new t().getMethods(),i=async(e={})=>(e.langDefinitions&&console.log("Language definitions set:",e.langDefinitions),e.models&&console.log("Data models configured:",e.models),{success:!0,config:e});export{h as fetchGraphQl,d as getCompany,c as getConfig,i as initialize,m as removeFetchGraphQlHeader,g as setEndpoint,f as setFetchGraphQlHeader,u as setFetchGraphQlHeaders,G as updateCompany};
//# sourceMappingURL=api.js.map
