import type { AirDatepickerOptions } from 'air-datepicker';
import { DateTime } from 'luxon';
import { extendAlpine } from '../manager';

type DirectiveOptions = {
    range?: true;
    time?: true;
    date?: true;
};

export default () => {
    extendAlpine(async (alpine) => {
        const { default: DatePicker } = await import('air-datepicker');
        const { default: localeFr } = await import('air-datepicker/locale/fr');
        const { createPopper } = await import('@popperjs/core');

        alpine.data('datePicker', (initialStateArguments) => {
            const directiveOptions = initialStateArguments as DirectiveOptions;

            return {
                init() {
                    new DatePicker((this.$el as HTMLInputElement), this.getOptions());
                },
                getOptions(): AirDatepickerOptions {
                    const element = this.$el as HTMLInputElement;
                    let buttons: AirDatepickerOptions['buttons'];

                    buttons = directiveOptions.time && !directiveOptions.date ? ['clear'] : ['today', 'clear'];

                    return {
                        ...directiveOptions,
                        locale: localeFr,
                        isMobile: window.innerWidth < 600,
                        autoClose: true,
                        selectedDates: element.value ? [DateTime.fromSQL(element.value).toJSDate()] : [],
                        buttons,
                        monthsField: 'months',
                        selectOtherMonths: false,
                        range: !directiveOptions.time && directiveOptions.range,
                        timepicker: directiveOptions.time,
                        onlyTimepicker: !directiveOptions.date,
                        dateFormat: 'yyyy-MM-dd',
                        multipleDatesSeparator: ' - ',
                        timeFormat: 'HH:mm',
                        position: ({ $datepicker, $target, $pointer, done }) => {
                            let popper = createPopper($target, $datepicker, {
                                placement: 'top',
                                modifiers: [
                                    {
                                        name: 'flip',
                                        options: {
                                            padding: {
                                                top: 64,
                                            },
                                        },
                                    },
                                    {
                                        name: 'offset',
                                        options: {
                                            offset: [0, 20],
                                        },
                                    },
                                    {
                                        name: 'arrow',
                                        options: {
                                            element: $pointer,
                                        },
                                    },
                                ],
                            });

                            return function completeHide() {
                                popper.destroy();
                                done();
                            };
                        },
                        navTitles: {
                            days: 'MMMM yyyy',
                        },
                    };
                },
            };
        });
    });
}
