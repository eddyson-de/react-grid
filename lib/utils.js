const activeColumnKeys = (columnConfigs) => {
    return columnConfigs.filter(config => !config.hide === true).map(config => {
        return config.name;
    });
};

export { activeColumnKeys };
