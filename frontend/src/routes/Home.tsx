import {
  AppShellMain,
  Button,
  Container,
  SimpleGrid,
  Skeleton,
  Space,
  Text,
} from '@mantine/core';
import RepoStackCard from '../components/RepoStackCard';
import { useQuery } from 'react-query';
import type { ListIrsMetadataResponse } from '../types';
import axios from 'axios';
import { useEffect, useState } from 'react';
import classes from './Home.module.css';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';

const listIrsMetaDataUrl = 'https://zkcir.chrisc.dev/v1/ir/metadata/list';

export default function Home() {
  const user = useUser();

  const { data: irs, isLoading } = useQuery(
    listIrsMetaDataUrl,
    async () => {
      const response = await axios.get<ListIrsMetadataResponse>(
        listIrsMetaDataUrl,
        {
          headers: {
            Authorization: `Bearer ${user.user?.auth_token}`,
          },
        },
      );
      return response.data;
    },
    {
      enabled: !!user.user,
    },
  );

  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => setShowLoading(true), 500);
    } else {
      setShowLoading(false);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading]);

  return (
    <AppShellMain>
      <Container
        size={700}
        className={classes.inner}
        style={{
          marginTop: '2rem',
        }}
      >
        {!isLoading && (!user.user || !irs?.irs || irs?.irs.length == 0) && (
          <>
            <Space h="xl" />
            <h1 className={classes.title}>
              A{' '}
              <Text
                component="span"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                inherit
              >
                framework-agnostic
              </Text>{' '}
              ZK proof circuit intermediate representation compiler
            </h1>

            <Text className={classes.description} c="dimmed">
              Generate intermediate representations for zero knowledge proof
              circuits to help analyze and find security flaws over a
              framework-agnostic environment.
            </Text>

            <Link to="/new-circuit">
              <Button
                size="xl"
                className={classes.control}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                style={{
                  marginTop: '2rem',
                }}
              >
                Create new circuit
              </Button>
            </Link>
          </>
        )}

        <SimpleGrid cols={2}>
          {showLoading ? (
            <>
              <Skeleton height={8} mt={6} width="100%" radius="xl" />
              <Skeleton height={8} mt={6} width="100%" radius="xl" />
              <Skeleton height={8} mt={6} width="100%" radius="xl" />
              <Skeleton height={8} mt={6} width="100%" radius="xl" />
              <Skeleton height={8} mt={6} width="100%" radius="xl" />
              <Skeleton height={8} mt={6} width="70%" radius="xl" />
            </>
          ) : (
            (irs?.irs || []).map((item, index) => (
              <RepoStackCard
                name={item.repo_name}
                description={item.description}
                key={index}
                ownerSub={user.user?.sub || ''}
              />
            ))
          )}
        </SimpleGrid>
      </Container>
    </AppShellMain>
  );
}
