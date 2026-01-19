import React, { useEffect, useState } from "react";
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
import { toast } from "sonner";

interface MovieRatingFormProps {
  movieId: number;
}

export const MovieRatingForm: React.FC<MovieRatingFormProps> = ({
  movieId,
}) => {
  const { sessionId } = useAccount();
  const [addRating, { isLoading, isError }] = useAddMovieRatingMutation();
  const [submittedRating, setSubmittedRating] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
  } = useForm<RatingFormValues>({
    defaultValues: { value: 0.5 },
    resolver: zodResolver(ratingSchema),
  });

  const {
    data: accountState,
    isLoading: isAccountStateLoading,
  } = useGetMovieAccountStatesQuery(
    { movieId, sessionId: sessionId! },
    { skip: !sessionId }
  );

  const currentValue = useWatch({ control, name: "value" });

  const ratedFromApi =
    typeof accountState?.rated === "object" && "value" in accountState.rated;

  const alreadyRated = ratedFromApi || submittedRating !== null;

  const displayRating = submittedRating ??
    (ratedFromApi ? (accountState!.rated as { value: number }).value : null);

  useEffect(() => {
    if (ratedFromApi) {
      setValue("value", (accountState!.rated as { value: number }).value);
    }
  }, [ratedFromApi, accountState, setValue]);

  const onSubmit = async (data: RatingFormValues) => {
    if (!sessionId) {
      toast.warning("Você precisa estar logado para avaliar.");
      return;
    }

    try {
      await addRating({ movieId, value: data.value, sessionId }).unwrap();
      setSubmittedRating(data.value);
      toast.success("Avaliação enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      toast.error("Erro ao enviar avaliação. Tente novamente.");
    }
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
      {alreadyRated && displayRating !== null ? (
        <Typography variant="h6" mb={1} fontWeight="bold">
          Sua avaliação: ⭐ {displayRating.toFixed(1)} /10
        </Typography>
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
