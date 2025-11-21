import { Card, CardBody, Button, Chip } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const CreateRoomStep2 = ({
    totalPlayers,
    nbrUserPlayers,
    setNbrUserPlayers,
    onNext,
    onPrevious,
    errorMessage
}) => {
    const { t } = useTranslation();
    const nbrCPUPlayers = totalPlayers - nbrUserPlayers;

    const handlePlayerSelect = (count) => {
        setNbrUserPlayers(count);
    };

    // Generate array of possible player counts (1 to totalPlayers)
    const playerOptions = Array.from({ length: totalPlayers }, (_, i) => i + 1);

    return (
        <div className="flex flex-col gap-6">
            {/* Summary Card */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardBody className="p-6">
                    <h3 className="text-white text-lg font-semibold mb-4">
                        {t("create.howManyRealPlayers")}
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-primary/20 rounded-lg p-4 border border-primary/30">
                            <p className="text-white/60 text-xs mb-1">
                                {t("create.userControlled")}
                            </p>
                            <p className="text-white text-2xl font-bold">{nbrUserPlayers}</p>
                        </div>
                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <p className="text-white/60 text-xs mb-1">
                                {t("create.CPUControlled")}
                            </p>
                            <p className="text-white text-2xl font-bold">{nbrCPUPlayers}</p>
                        </div>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/30">
                        <p className="text-white/60 text-xs mb-1">
                            {t("create.totalPlayers")}
                        </p>
                        <p className="text-white text-2xl font-bold">{totalPlayers}</p>
                    </div>
                </CardBody>
            </Card>

            {/* Player Selection Grid */}
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardBody className="p-6">
                    <h4 className="text-white font-semibold mb-4">
                        {t("create.selectNumberOfPlayers")}
                    </h4>

                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {playerOptions.map((count) => (
                            <Button
                                key={count}
                                onClick={() => handlePlayerSelect(count)}
                                className={`
                  min-w-0 h-12 font-bold text-lg
                  ${nbrUserPlayers === count
                                        ? 'bg-primary text-white scale-110 shadow-lg'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                    }
                  transition-all duration-200
                `}
                                variant={nbrUserPlayers === count ? "solid" : "flat"}
                            >
                                {count}
                            </Button>
                        ))}
                    </div>

                    {/* Visual representation */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <Chip size="sm" color="primary" variant="flat">
                                {nbrUserPlayers} {t("create.realPlayers")}
                            </Chip>
                            {nbrCPUPlayers > 0 && (
                                <Chip size="sm" color="secondary" variant="flat">
                                    {nbrCPUPlayers} CPU
                                </Chip>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1">
                            {Array.from({ length: nbrUserPlayers }).map((_, i) => (
                                <div
                                    key={`user-${i}`}
                                    className="w-8 h-8 rounded-full bg-primary/80 flex items-center justify-center text-white text-xs font-bold"
                                    title={t("create.realPlayer")}
                                >
                                    👤
                                </div>
                            ))}
                            {Array.from({ length: nbrCPUPlayers }).map((_, i) => (
                                <div
                                    key={`cpu-${i}`}
                                    className="w-8 h-8 rounded-full bg-secondary/80 flex items-center justify-center text-white text-xs font-bold"
                                    title="CPU"
                                >
                                    🤖
                                </div>
                            ))}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Info Box */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                <p className="text-white/70 text-sm flex items-center gap-2">
                    <span className="text-lg">💡</span>
                    <span>{t("create.info.cpuExplanation")}</span>
                </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3">
                <Button
                    color="secondary"
                    variant="shadow"
                    onClick={onPrevious}
                    size="lg"
                    className="font-semibold"
                >
                    ← {t("create.previousStep")}
                </Button>
                <Button
                    color="primary"
                    variant="shadow"
                    onClick={onNext}
                    size="lg"
                    className="font-semibold flex-1"
                >
                    {t("create.nextStep")} →
                </Button>
            </div>

            {errorMessage && (
                <p className="text-danger text-sm text-center">
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

export default CreateRoomStep2;