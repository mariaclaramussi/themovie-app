import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Slider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAddMovieRatingMutation,
  useGetMovieAccountStatesQuery,
} from "../api/movieApi";
import { useAccount } from "../hooks/useAccount";
import { ratingSchema, RatingFormValues } from "../schemas/rating.schema";

interface MovieRatingFormProps {
  movieId: number;
}

export const MovieRatingForm: React.FC<MovieRatingFormProps> = ({
  movieId,
}) => {
  const { sessionId } = useAccount();
  const [addRating, { isLoading, isError }] = useAddMovieRatingMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<RatingFormValues>({
    defaultValues: { value: 0.5 },
    resolver: zodResolver(ratingSchema),
  });

  const {
    data: accountState,
    isLoading: isAccountStateLoading,
    refetch,
  } = useGetMovieAccountStatesQuery(
    { movieId, sessionId: sessionId! },
    { skip: !sessionId }
  );

  const currentValue = useWatch({ control, name: "value" });

  const alreadyRated =
    typeof accountState?.rated === "object" && "value" in accountState.rated;

  useEffect(() => {
    if (alreadyRated) {
      setValue("value", (accountState!.rated as { value: number }).value);
    }
  }, [alreadyRated, accountState, setValue]);

  const onSubmit = async (data: RatingFormValues) => {
    if (!sessionId) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }

    await addRating({ movieId, value: data.value, sessionId });
    await refetch();
    reset({ value: data.value });
  };

  if (isAccountStateLoading) {
    return (
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {alreadyRated ? (
        <>
          <Typography variant="h6" mb={1} fontWeight="bold">
            Sua avaliação: ⭐{" "}
            {(accountState!.rated as { value: number }).value.toFixed(1)} /10
          </Typography>
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" mb={1} fontWeight="bold">
            Avaliar
          </Typography>
          <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
            ⭐ {currentValue.toFixed(1)}
          </Typography>

          <Controller
            name="value"
            control={control}
            render={({ field }) => (
              <>
                <Slider
                  {...field}
                  value={field.value}
                  onChange={(_, newValue) => field.onChange(newValue)}
                  min={0.5}
                  max={10}
                  step={0.5}
                  marks
                  valueLabelDisplay="auto"
                  sx={{ width: "80%", mb: 1 }}
                />
                {errors.value && (
                  <Typography color="error" variant="body2">
                    {errors.value.message}
                  </Typography>
                )}
              </>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !isDirty}
            color="primary"
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={22} /> : "Enviar avaliação"}
          </Button>

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Ocorreu um erro ao enviar a avaliação.
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};
