import { Card, CardContent, CardActions, Skeleton } from "@mui/material";

export function MovieCardSkeleton() {
  return (
    <Card>
      <Skeleton
        variant="rectangular"
        height={300}
        animation="wave"
        sx={{ bgcolor: "grey.800" }}
      />
      <CardContent sx={{ p: 1 }}>
        <Skeleton
          variant="text"
          width="80%"
          height={24}
          animation="wave"
          sx={{ bgcolor: "grey.800" }}
        />
        <Skeleton
          variant="text"
          width="40%"
          height={20}
          animation="wave"
          sx={{ bgcolor: "grey.800" }}
        />
      </CardContent>
      <CardActions sx={{ p: 1 }}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={30}
          animation="wave"
          sx={{ bgcolor: "grey.800", borderRadius: 1 }}
        />
      </CardActions>
    </Card>
  );
}
