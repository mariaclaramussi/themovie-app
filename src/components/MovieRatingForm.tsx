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
import {
  useAddMovieRatingMutation,
  useGetMovieAccountStatesQuery,
} from "../api/movieApi";
import { useAccount } from "../hooks/useAccount";

interface MovieRatingFormProps {
  movieId: number;
}

interface RatingFormValues {
  value: number;
}

export const MovieRatingForm: React.FC<MovieRatingFormProps> = ({
  movieId,
}) => {
  const { sessionId } = useAccount();
  const [addRating, { isLoading, isSuccess, isError }] =
    useAddMovieRatingMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
  } = useForm<RatingFormValues>({
    defaultValues: { value: 5 },
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
        alignItems: "center",
      }}
    >
      <Typography variant="h6" mb={1}>
        Avaliar este filme
      </Typography>

      {alreadyRated ? (
        <>
          <Typography variant="h5" color="primary">
            ⭐ {(accountState!.rated as { value: number }).value.toFixed(1)}
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Você já avaliou este filme.
            <br />
            Sua nota:{" "}
            {(accountState!.rated as { value: number }).value.toFixed(1)}
          </Alert>
        </>
      ) : (
        <>
          <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
            ⭐ {currentValue.toFixed(1)}
          </Typography>

          <Controller
            name="value"
            control={control}
            rules={{
              required: "A nota é obrigatória",
              min: { value: 0.5, message: "Mínimo é 0.5" },
              max: { value: 10, message: "Máximo é 10" },
            }}
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

          {isSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              🎉 Avaliação enviada com sucesso!
            </Alert>
          )}

          {isError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              Ocorreu um erro ao enviar a avaliação.
            </Alert>
          )}
        </>
      )}
    </Box>
  );
};
