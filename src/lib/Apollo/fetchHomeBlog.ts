import client from '@/lib/Apollo/apolloClientWP';
import { gql } from '@apollo/client';
import HomeBlogQuery from '@/lib/Query/HomeBlogQuery';

export const fetchHomeBlog = async () => {
  const GET_POST = gql`
    ${HomeBlogQuery}
  `;

  const { data } = await client.query({ query: GET_POST });
  return data;
};
